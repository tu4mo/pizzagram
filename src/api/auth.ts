import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  getCountFromServer,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'

import { auth, firestore } from '.'

export function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(auth, email)
}

export async function getCurrentUser() {
  await auth.authStateReady()
  return auth.currentUser
}

let isSigningUp = false

let onAuthStateChangedCallback: (user: User | null) => void = () => undefined

auth.onAuthStateChanged(async (user) => {
  !isSigningUp && onAuthStateChangedCallback(user)
})

export function setOnAuthStateChangedCallback(
  callback: (user: User | null) => Promise<void>,
) {
  onAuthStateChangedCallback = callback
}

export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  isSigningUp = true

  const md5 = (await import('md5')).default

  const querySnapshot = await getCountFromServer(
    query(collection(firestore, 'users_2'), where('username', '==', username)),
  )

  if (querySnapshot.data().count > 0) {
    throw new Error('Username already exists.')
  }

  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )

  await updateProfile(userCredentials.user, { displayName: username })

  const docRef = doc(firestore, 'users_2', userCredentials.user.uid)

  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    gravatar: md5(email.toLowerCase()),
    id: userCredentials.user.uid,
    username,
  })

  onAuthStateChangedCallback(userCredentials.user)

  isSigningUp = false
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  await auth.signOut()
}
