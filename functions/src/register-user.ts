import { getAuth } from 'firebase-admin/auth'
import * as functionsV2 from 'firebase-functions/v2'
import type { CallableRequest } from 'firebase-functions/v2/https'
import md5 = require('md5')

import { db } from './db'

const authService = getAuth()

type Data = {
  username: string
}

const usersCollection = db.collection('users_2')

async function onCreate(callableRequest: CallableRequest<Data>) {
  const {
    auth,
    data: { username },
  } = callableRequest

  if (!auth) {
    return false
  }

  console.log(`Registering user "${username}" (${auth.uid})...`)

  const querySnapshot = await usersCollection
    .where('username', '==', username)
    .count()
    .get()

  if (querySnapshot.data().count > 0) {
    console.log('Username already exists.')
    return false
  }

  const user = await authService.getUser(auth.uid)

  usersCollection.doc(user.uid).set({
    createdAt: new Date(),
    gravatar: md5(user.email || ''),
    id: user.uid,
    username,
  })

  console.log(`User ${username} registered`)

  return true
}

export const registerUser = functionsV2.https.onCall(
  { enforceAppCheck: true },
  onCreate,
)
