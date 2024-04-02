import type { UserRecord } from 'firebase-admin/auth'
import { getAuth } from 'firebase-admin/auth'
import type { CallableRequest } from 'firebase-functions/v2/https'
import md5 from 'md5'

import { db } from './db'

const authService = getAuth()

type Data = {
  email: string
  username: string
  password: string
}

const usersCollection = db.collection('users_2')

export async function registerUser(callableRequest: CallableRequest<Data>) {
  const {
    data: { email, username, password },
  } = callableRequest

  // return user.size() > 2 && user.size() < 16 && user.matches('[0-9A-Za-z_]+') == true;

  if (
    username.length < 3 ||
    username.length > 15 ||
    !/^[0-9A-Za-z_]+$/.test(username)
  ) {
    return null
  }

  console.log(`Registering user "${username}"...`)

  const querySnapshot = await usersCollection
    .where('username', '==', username)
    .count()
    .get()

  if (querySnapshot.data().count > 0) {
    console.log('Username already exists.')
    return null
  }

  let user: UserRecord | null = null

  try {
    user = await authService.createUser({
      displayName: username,
      email,
      password,
    })
  } catch (error) {
    console.log('Error creating user')
    return null
  }

  await usersCollection.doc(user.uid).set({
    createdAt: new Date(),
    gravatar: md5(user.email || ''),
    id: user.uid,
    username,
  })

  console.log(`User "${username}" (${user.uid}) registered`)

  return user
}
