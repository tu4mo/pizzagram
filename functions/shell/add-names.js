const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const addNames = async () => {
  const usersSnapshot = await db.collection('users').get()

  usersSnapshot.forEach(async (userRef) => {
    await db.collection('users').doc(userRef.id).update({ name: userRef.id })
    console.log(userRef.id)
  })
}

addNames()
