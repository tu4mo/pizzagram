import * as tf from '@tensorflow/tfjs-node'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { FieldValue } from 'firebase-admin/firestore'
import type { CallableRequest } from 'firebase-functions/v2/https'
import sharp from 'sharp'

import { posts } from './db'
import { bucket } from './storage'

type Data = {
  caption: string
  image: string
}

export async function verifyImage(request: CallableRequest<Data>) {
  const { image, caption } = request.data
  const imageBuffer = Buffer.from(image, 'base64')

  const jpeg = await sharp(imageBuffer)
    .rotate()
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
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

    const newPost = await posts.add({
      caption,
      createdAt: FieldValue.serverTimestamp(),
      imageUrl: null,
      published: false,
      updatedAt: FieldValue.serverTimestamp(),
      userId: request.auth.uid,
    })

    console.log('Saving image')

    await bucket.file(`posts/${newPost.id}.jpg`).save(jpeg)

    console.log('Updating post with public image URL')

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/posts%2F${newPost.id}.jpg?alt=media`

    await posts.doc(newPost.id).update({
      imageUrl,
      published: true,
      updatedAt: FieldValue.serverTimestamp(),
    })

    console.log('Done')

    return true
  } catch (error) {
    console.error(error)
  }

  return false
}
