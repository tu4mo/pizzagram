import * as path from 'path'

import { Storage } from '@google-cloud/storage'
import sharp from 'sharp'

const storage = new Storage()

export default async function () {
  const size = 256
  const fileBucket = 'gs://pizzagram-cc.appspot.com'
  const filePath = 'posts/3U0qy2bulkWxJWPXSElt.jpg'
  const contentType = 'image/jpeg'

  const bucket = storage.bucket(fileBucket)

  const { name } = path.parse(filePath)
  const resizedFileName = size === 256 ? `${name}_t.jpg` : `${name}.jpg`
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
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .pipe(resizedUploadStream)

  bucket.file(filePath).createReadStream().pipe(pipeline)

  const streamAsPromise = new Promise((resolve, reject) =>
    resizedUploadStream.on('finish', resolve).on('error', reject),
  )

  return streamAsPromise.then(() => {
    console.log('Resized image created successfully.')
    return null
  })
}
