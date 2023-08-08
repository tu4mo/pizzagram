import type * as functionsV2 from 'firebase-functions/v2'
import { Storage } from '@google-cloud/storage'
import * as path from 'path'
import * as sharp from 'sharp'

const storage = new Storage()

export default async (
  event: functionsV2.storage.StorageEvent,
  isThumbnail: boolean,
) => {
  const fileBucket = event.data.bucket
  const filePath = event.data.name
  const contentType = event.data.contentType

  if (!filePath) {
    return
  }

  const { name } = path.parse(filePath)

  if (!contentType?.startsWith('image/')) {
    console.log(`${name}: Not an image`)
    return
  }

  if (event.data.metadata?.resized) {
    console.log(`${name}: Already resized`)
    return
  }

  const bucket = storage.bucket(fileBucket)

  const size = isThumbnail ? 256 : 1024
  const resizedFileName = isThumbnail ? `${name}_t.jpg` : `${name}.jpg`
  const resizedFilePath = path.join(path.dirname(filePath), resizedFileName)

  const resizedUploadStream = bucket.file(resizedFilePath).createWriteStream({
    metadata: {
      contentType: contentType,
      metadata: { resized: 'true' },
    },
  })

  const pipeline = sharp()

  pipeline
    .rotate()
    .resize(size, size, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
    .pipe(resizedUploadStream)

  bucket.file(filePath).createReadStream().pipe(pipeline)

  await new Promise((resolve, reject) =>
    resizedUploadStream.on('finish', resolve).on('error', reject),
  )

  console.log(`${resizedFileName}: Created successfully`)
}
