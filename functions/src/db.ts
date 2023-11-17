import * as admin from 'firebase-admin'

const db = admin.firestore()

db.settings({ timestampsInSnapshots: true })

export { db }
