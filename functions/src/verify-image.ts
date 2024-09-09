import * as tf from '@tensorflow/tfjs-node-gpu'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import type { CallableRequest } from 'firebase-functions/v2/https'
import sharp from 'sharp'

type Data = {
  image: string
}

export async function verifyImage(request: CallableRequest<Data>) {
  const base64Image = request.data.image
  const imageBuffer = Buffer.from(base64Image, 'base64')

  const jpeg = await sharp(imageBuffer).toFormat('jpeg').toBuffer()
  const imgTensor = tf.node.decodeJpeg(new Uint8Array(jpeg), 3)

  try {
    const model = await cocoSsd.load()
    // @ts-expect-error node and cocoSsd types are not compatible
    const predictions = await model.detect(imgTensor)
    const isPizza = predictions.some(
      (prediction) => prediction.class === 'pizza',
    )

    return isPizza
  } catch (error) {
    console.error(error)
  }

  return false
}
