import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const usersSnapshot = await db.collection('users').get()

usersSnapshot.forEach(async (userRef) => {
  await db
    .collection('users')
    .doc(userRef.id)
    .update({ name: admin.firestore.FieldValue.delete() })

  console.log(userRef.id)
})
