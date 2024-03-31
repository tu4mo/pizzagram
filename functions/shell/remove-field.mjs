import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

const collection = 'users_2'
const obsoleteField = 'posts'

console.log('Removing field: ', obsoleteField)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const usersSnapshot = await db.collection(collection).get()

usersSnapshot.forEach(async (userRef) => {
  await db
    .collection(collection)
    .doc(userRef.id)
    .update({ [obsoleteField]: admin.firestore.FieldValue.delete() })

  console.log(userRef.id)
})
