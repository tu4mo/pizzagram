import {
  deleteUser,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'

import { auth, functions } from './firebase'

export function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(auth, email)
}

export async function getCurrentUser() {
  await auth.authStateReady()
  return auth.currentUser
}

const registerUser = httpsCallable<
  { email: string; username: string; password: string },
  { user: User; error: null } | { user: null; error: string }
>(functions, 'registerUser')

export function setOnAuthStateChangedCallback(
  callback: (user: User | null) => Promise<void>,
) {
  auth.onAuthStateChanged(callback)
}

export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  const {
    data: { error },
  } = await registerUser({ email, password, username })

  if (error) {
    throw new Error(error)
  }

  await signIn(email, password)
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  await auth.signOut()
}

export async function deleteAccount() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('User is not authenticated')
  }

  return deleteUser(user)
}
