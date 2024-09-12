const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pizzagram-cc.firebaseio.com',
})

const db = admin.firestore()
const auth = admin.auth()

const usersInDb = []

const syncNames = async () => {
  const usersSnapshot = await db.collection('users').get()

  usersSnapshot.forEach(async (userRef) => {
    const userId = userRef.data().id
    usersInDb.push(userId)
  })
}

;(async function () {
  await syncNames()
  const usersInAuth = await auth.listUsers()

  for await (const user of usersInAuth.users) {
    if (!usersInDb.includes(user.uid)) {
      console.log(`${user.uid} missing in db`)
      await auth.deleteUser(user.uid)
    }
  }
})()
