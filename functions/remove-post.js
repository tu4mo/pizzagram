/* eslint no-console: "off" */

const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

module.exports = async snap => {
  const id = snap.id;

  const bucket = storage.bucket("pizzagram-cc.appspot.com");
  const photoFile = bucket.file(`posts/${id}.jpg`);
  const thumbnailFile = bucket.file(`posts/${id}_128.jpg`);

  try {
    await photoFile.delete();
    await thumbnailFile.delete();
    console.log(`${photoFile.name} and ${thumbnailFile.name} removed.`);
  } catch (error) {
    console.log(`Failed to remove photo (${error}).`);
  }
};
