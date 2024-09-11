import * as tf from '@tensorflow/tfjs-node'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { FieldValue } from 'firebase-admin/firestore'
import { getDownloadURL } from 'firebase-admin/storage'
import type { CallableRequest } from 'firebase-functions/v2/https'
import sharp from 'sharp'

import { posts } from './db'
import { bucket } from './storage'

type Data = {
  caption: string
  image: string
}

export async function sharePost(request: CallableRequest<Data>) {
  const { image: imageAsString, caption } = request.data
  const imageBuffer = Buffer.from(imageAsString, 'base64')

  const image = await sharp(imageBuffer)
    .rotate()
    .resize(1024, 1024, { fit: 'inside' })
    .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
    .toBuffer()

  const thumbnail = await sharp(imageBuffer)
    .rotate()
    .resize(256, 256, { fit: 'inside' })
    .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
    .toBuffer()

  const imgTensor = tf.node.decodeJpeg(new Uint8Array(image), 3)

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

    const newPost = await posts.add({
      caption,
      createdAt: FieldValue.serverTimestamp(),
      imageUrl: null,
      published: false,
      thumbnailUrl: null,
      updatedAt: FieldValue.serverTimestamp(),
      userId: request.auth.uid,
    })

    console.log('Saving image')

    const file = bucket.file(`posts/${newPost.id}.jpg`)
    await file.save(image)

    const thumbnailFile = bucket.file(`posts/${newPost.id}_t.jpg`)
    await thumbnailFile.save(thumbnail)

    console.log('Updating post with public image URL')

    await posts.doc(newPost.id).update({
      imageUrl: await getDownloadURL(file),
      published: true,
      thumbnailUrl: await getDownloadURL(thumbnailFile),
      updatedAt: FieldValue.serverTimestamp(),
    })

    console.log('Done')

    return true
  } catch (error) {
    console.error(error)
  }

  return false
}
