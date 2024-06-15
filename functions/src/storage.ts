import { Storage } from '@google-cloud/storage'

const storage = new Storage()

export const bucket = storage.bucket('pizzagram-cc.appspot.com')
