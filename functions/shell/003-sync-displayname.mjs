import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const auth = admin.auth()

const db = admin.firestore()

const usersInAuth = await auth.listUsers()

for (const user of usersInAuth.users) {
  const doc = await db.collection('users').where('id', '==', user.uid).get()

  if (!doc.empty) {
    const displayName = doc.docs[0].id
    console.log(`Changing users ${user.uid} displayName to ${displayName}`)
    auth.updateUser(user.uid, { displayName })
  }
}
