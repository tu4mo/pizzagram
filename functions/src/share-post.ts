import * as tf from '@tensorflow/tfjs-node'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { FieldValue } from 'firebase-admin/firestore'
import { getDownloadURL } from 'firebase-admin/storage'
import type { CallableRequest } from 'firebase-functions/https'
import sharp from 'sharp'

import { posts } from './db.js'
import { bucket } from './storage.js'
import { generateUserFeed } from './utils/generate-user-feed.js'
import { updatePostsCount } from './utils/update-posts-count.js'

type Data = {
  caption: string
  image: string
}

export async function sharePost(request: CallableRequest<Data>) {
  const { image: imageAsString, caption } = request.data
  const imageBuffer = Buffer.from(imageAsString, 'base64')

  const jpeg = await sharp(imageBuffer)
    .resize(1024, 1024)
    .jpeg({ quality: 80 })
    .toBuffer()

  const image = await sharp(imageBuffer)
    .resize(1024, 1024)
    .webp({ quality: 80 })
    .toBuffer()

  const thumbnail = await sharp(imageBuffer)
    .resize(256, 256)
    .webp({ quality: 80 })
    .toBuffer()

  const imgTensor = tf.node.decodeJpeg(new Uint8Array(jpeg), 3)

  try {
    console.log('Detecting pizza')

    const model = await cocoSsd.load()
    const predictions = await model.detect(imgTensor)
    const isPizza = predictions.some(
      (prediction) => prediction.class === 'pizza',
    )

    if (!isPizza || !request.auth?.uid || caption.length > 100) {
      return false
    }

    console.log('Creating a post')

    const userId = request.auth.uid

    const newPost = await posts.add({
      caption,
      createdAt: FieldValue.serverTimestamp(),
      imageUrl: null,
      published: false,
      thumbnailUrl: null,
      updatedAt: FieldValue.serverTimestamp(),
      userId,
    })

    console.log('Saving image')

    const file = bucket.file(`posts/${newPost.id}.webp`)
    await file.save(image)

    const thumbnailFile = bucket.file(`posts/${newPost.id}_t.webp`)
    await thumbnailFile.save(thumbnail)

    console.log('Updating post with public image URL')

    await posts.doc(newPost.id).update({
      imageUrl: await getDownloadURL(file),
      published: true,
      thumbnailUrl: await getDownloadURL(thumbnailFile),
      updatedAt: FieldValue.serverTimestamp(),
    })

    await Promise.all([updatePostsCount(userId), generateUserFeed(userId)])

    console.log('Done')

    return true
  } catch (error) {
    console.error(error)
  }

  return false
}
