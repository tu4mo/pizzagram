/* eslint no-console: "off" */

"use strict";

const functions = require("firebase-functions");
const gcs = require("@google-cloud/storage")();
const path = require("path");
const sharp = require("sharp");

const SIZES = [128, 1024];

const isResizedImage = filename =>
  SIZES.map(size => filename.endsWith(`_${size}.jpg`)).some(
    endsWith => endsWith
  );

const resizeImage = (object, size) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  if (!contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return null;
  }

  const { base, name } = path.parse(filePath);
  if (isResizedImage(base)) {
    console.log("Already resized.");
    return null;
  }

  const bucket = gcs.bucket(fileBucket);

  const metadata = {
    contentType: contentType
  };

  const resizedFileName = `${name}_${size}.jpg`;
  const resizedFilePath = path.join(path.dirname(filePath), resizedFileName);

  const resizedUploadStream = bucket
    .file(resizedFilePath)
    .createWriteStream({ metadata });

  const pipeline = sharp();
  pipeline
    .resize(size, size)
    .max()
    .withoutEnlargement()
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

exports.generateResizedImages = functions.storage.object().onFinalize(object =>
  Promise.all(SIZES.map(size => resizeImage(object, size))).then(() => {
    if (!isResizedImage(object.name)) {
      return gcs
        .bucket(object.bucket)
        .file(object.name)
        .delete()
        .then(() => {
          console.log("Original image deleted.");
        });
    }
  })
);
