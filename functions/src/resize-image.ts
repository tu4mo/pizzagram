import * as functions from 'firebase-functions'
import { Storage } from '@google-cloud/storage'
import * as path from 'path'
import * as sharp from 'sharp'

const storage = new Storage()

export default async (
  object: functions.storage.ObjectMetadata,
  size: number
) => {
  const fileBucket = object.bucket
  const filePath = object.name
  const contentType = object.contentType

  if (!filePath) {
    return
  }

  const { name } = path.parse(filePath)

  if (!contentType || !contentType.startsWith('image/')) {
    console.log(`${name}: Not an image`)
    return
  }

  if (object.metadata && object.metadata.resized) {
    console.log(`${name}: Already resized`)
    return
  }

  const bucket = storage.bucket(fileBucket)

  const resizedFileName = size === 256 ? `${name}_t.jpg` : `${name}.jpg`
  const resizedFilePath = path.join(path.dirname(filePath), resizedFileName)

  const resizedUploadStream = bucket.file(resizedFilePath).createWriteStream({
    metadata: {
      contentType: contentType,
      metadata: { resized: true }
    }
  })

  const pipeline = sharp()

  pipeline
    .rotate()
    .resize(size, size, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .pipe(resizedUploadStream)

  bucket
    .file(filePath)
    .createReadStream()
    .pipe(pipeline)

  await new Promise((resolve, reject) =>
    resizedUploadStream.on('finish', resolve).on('error', reject)
  )

  console.log(`${resizedFileName}: Created successfully`)
}
