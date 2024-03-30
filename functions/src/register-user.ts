import { getAuth } from 'firebase-admin/auth'
import * as functionsV2 from 'firebase-functions/v2'
import type { CallableRequest } from 'firebase-functions/v2/https'
import md5 = require('md5')

import { db } from './db'

const authService = getAuth()

type Data = {
  username: string
}

async function onCreate(callableRequest: CallableRequest<Data>) {
  const {
    auth,
    data: { username },
  } = callableRequest

  if (!auth) {
    return
  }

  console.log(`Registering user "${username}" (${auth.uid})...`)

  const user = await authService.getUser(auth.uid)

  const usersCollection = db.collection('users_2')
  usersCollection.doc(user.uid).set({
    createdAt: new Date(),
    gravatar: md5(user.email || ''),
    id: user.uid,
    username,
  })

  console.log(`User ${username} registered`)
}

export const registerUser = functionsV2.https.onCall(
  { enforceAppCheck: true },
  onCreate,
)
