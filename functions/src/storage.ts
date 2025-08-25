import { getStorage } from 'firebase-admin/storage'

const storage = getStorage()

export const bucket = storage.bucket('pizzagram-cc.appspot.com')
