import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs-node'
import type { CallableRequest } from 'firebase-functions/v2/https'

type Data = {
  image: string
}

export async function verifyImage(callableRequest: CallableRequest<Data>) {
  const base64Image = callableRequest.data.image
  const imageBuffer = Buffer.from(base64Image, 'base64')
  const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3)

  const model = await cocoSsd.load()
  const predictions = await model.detect(imgTensor as tf.Tensor3D)
  const isPizza = predictions.some((prediction) => prediction.class === 'pizza')

  return isPizza
}
