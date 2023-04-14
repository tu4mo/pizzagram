import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs-node'

type Data = {
  image: string
}

export const verifyImage = async (data: Data) => {
  const base64Image = data.image
  const imageBuffer = Buffer.from(base64Image, 'base64')
  const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3)

  const model = await cocoSsd.load()
  const predictions = await model.detect(imgTensor as tf.Tensor3D)
  const isPizza = predictions.some((prediction) => prediction.class === 'pizza')

  return isPizza
}
