import { Storage } from "@google-cloud/storage";
const storage = new Storage();

import * as path from "path";
import * as sharp from "sharp";

export default (size: number) => {
  const fileBucket = "gs://pizzagram-cc.appspot.com";
  const filePath = "posts/uQ5vp9zECuus72fbofnp.jpg";
  const contentType = "image/jpeg";

  const bucket = storage.bucket(fileBucket);

  const { name } = path.parse(filePath);
  const resizedFileName = size === 128 ? `${name}_${size}.jpg` : `${name}.jpg`;
  const resizedFilePath = path.join(path.dirname(filePath), resizedFileName);

  const resizedUploadStream = bucket.file(resizedFilePath).createWriteStream({
    metadata: {
      contentType: contentType,
      metadata: { resized: true }
    }
  });

  const pipeline = sharp();
  pipeline
    .rotate()
    .resize(size, size, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .pipe(resizedUploadStream);

  bucket
    .file(filePath)
    .createReadStream()
    .pipe(pipeline);

  const streamAsPromise = new Promise((resolve, reject) =>
    resizedUploadStream.on("finish", resolve).on("error", reject)
  );

  return streamAsPromise.then(() => {
    console.log("Resized image created successfully.");
    return null;
  });
};
