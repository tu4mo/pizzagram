import { createHash } from 'node:crypto'

import type { UserRecord } from 'firebase-admin/auth'
import { getAuth } from 'firebase-admin/auth'
import type { CallableRequest } from 'firebase-functions/v2/https'

import { users } from './db'

const authService = getAuth()

type Data = {
  email: string
  username: string
  password: string
}

export async function registerUser(callableRequest: CallableRequest<Data>) {
  const {
    data: { email, username, password },
  } = callableRequest

  if (
    username.length < 3 ||
    username.length > 15 ||
    !/^[0-9A-Za-z_]+$/.test(username)
  ) {
    return { user: null, error: 'Invalid username' }
  }

  console.log(`Registering user "${username}"...`)

  const querySnapshot = await users
    .where('username', '==', username)
    .count()
    .get()

  if (querySnapshot.data().count > 0) {
    console.log('Username already exists.')
    return { user: null, error: 'Username already exists' }
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
    return { user: null, error: 'Error creating user' }
  }

  await users.doc(user.uid).set({
    createdAt: new Date(),
    gravatar: createHash('sha256')
      .update(user.email ?? '')
      .digest('hex'),
    id: user.uid,
    username,
  })

  console.log(`User "${username}" (${user.uid}) registered`)

  return { user, error: null }
}
