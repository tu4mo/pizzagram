import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

import { auth, firestore } from '.'

export const sendPasswordResetEmail = (email: string) =>
  firebaseSendPasswordResetEmail(auth, email)

export async function currentUser() {
  await auth.authStateReady()
  return auth.currentUser
}

let isSigningUp = false

let onAuthStateChangedCallback: (user: User | null) => void = () => undefined

auth.onAuthStateChanged(async (user) => {
  !isSigningUp && onAuthStateChangedCallback(user)
})

export const setOnAuthStateChangedCallback = (
  callback: (user: User | null) => Promise<void>,
) => {
  onAuthStateChangedCallback = callback
}

export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  const md5 = (await import('md5')).default

  isSigningUp = true

  const docRef = doc(firestore, 'users', username)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    throw new Error('Username already exists.')
  }

  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    id: null,
  })

  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    await deleteDoc(docRef)
    throw error
  }

  const gravatar = md5(email.toLowerCase())

  const user = await currentUser()

  if (!user) {
    return
  }

  await updateProfile(user, { displayName: username })

  await updateDoc(docRef, { gravatar, id: user.uid })

  onAuthStateChangedCallback(user)

  isSigningUp = false
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  await auth.signOut()
}
