import * as tf from '@tensorflow/tfjs-node'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import type { CallableRequest } from 'firebase-functions/v2/https'

type Data = {
  image: string
}

export async function verifyImage(request: CallableRequest<Data>) {
  const base64Image = request.data.image
  const imageBuffer = Buffer.from(base64Image, 'base64')
  const imgTensor = tf.node.decodeJpeg(new Uint8Array(imageBuffer), 3)

  try {
    const model = await cocoSsd.load()
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
