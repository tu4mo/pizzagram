import { getStorage } from 'firebase-admin/storage'

export const bucket = getStorage().bucket('pizzagram-cc.appspot.com')
