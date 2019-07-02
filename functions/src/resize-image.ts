import * as functions from "firebase-functions";
import { Storage } from "@google-cloud/storage";
import * as path from "path";
import * as sharp from "sharp";

const storage = new Storage();

export default (object: functions.storage.ObjectMetadata, size: number) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  if (!filePath) {
    return null;
  }

  if (!contentType || !contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return null;
  }

  if (object.metadata && object.metadata.resized) {
    console.log("Already resized.");
    return null;
  }

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
