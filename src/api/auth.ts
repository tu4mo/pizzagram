import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import { auth, firestore } from '.'

import md5 from 'md5'

export const sendPasswordResetEmail = (email: string) =>
  firebaseSendPasswordResetEmail(auth, email)

export const currentUser = () => auth.currentUser

let isSigningUp = false

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let onAuthStateChangedCallback: (user: User | null) => void = () => undefined

auth.onAuthStateChanged(async (user) => {
  !isSigningUp && onAuthStateChangedCallback(user)
})

export const setOnAuthStateChangedCallback = (
  // eslint-disable-next-line no-unused-vars
  callback: (user: User | null) => Promise<void>
) => {
  onAuthStateChangedCallback = callback
}

export const initializeAuth = () =>
  new Promise<User | null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user)
    })
  })

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  isSigningUp = true

  const docRef = doc(firestore, 'users', username)

  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    id: null,
    name: username,
  })

  await createUserWithEmailAndPassword(auth, email, password)

  const gravatar = md5(email.toLowerCase())

  const user = currentUser()

  if (!user) {
    return
  }

  await updateDoc(docRef, { gravatar, id: user.uid })

  onAuthStateChangedCallback(user)

  isSigningUp = false
}

export const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  await auth.signOut()
}
