import {
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'

import { auth, functions } from '.'

export function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(auth, email)
}

export async function getCurrentUser() {
  await auth.authStateReady()
  return auth.currentUser
}

const registerUser = httpsCallable<
  { email: string; username: string; password: string },
  User | null
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
  const user = await registerUser({ email, username, password })

  if (!user.data) {
    throw new Error('Unable to register user')
  }

  await signIn(email, password)
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  await auth.signOut()
}
