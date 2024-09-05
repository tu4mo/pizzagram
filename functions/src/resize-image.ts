import * as path from 'path'

import { Storage } from '@google-cloud/storage'
import type * as functionsV2 from 'firebase-functions/v2'
import sharp from 'sharp'

const storage = new Storage()

export async function resizeImage(event: functionsV2.storage.StorageEvent) {
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

  if (event.data.metadata?.isThumbnail) {
    console.log(`${name}: Is already a thumbnail`)
    return
  }

  const bucket = storage.bucket(fileBucket)

  const size = 256
  const resizedFileName = `${name}_t.jpg`
  const resizedFilePath = path.join(path.dirname(filePath), resizedFileName)

  const resizedUploadStream = bucket.file(resizedFilePath).createWriteStream({
    metadata: {
      contentType: contentType,
      metadata: { isThumbnail: 'true' },
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
