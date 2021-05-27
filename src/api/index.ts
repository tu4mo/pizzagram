import firebase from 'firebase/compat/app'
// import { initializeApp } from 'firebase/app'
import {
  getAuth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import { createUserObject, currentUser } from './user'

import md5 from 'md5'

firebase.initializeApp({
  apiKey: 'AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg',
  authDomain: 'pizzagram-cc.firebaseapp.com',
  databaseURL: 'https://pizzagram-cc.firebaseio.com',
  projectId: 'pizzagram-cc',
  storageBucket: 'pizzagram-cc.appspot.com',
  messagingSenderId: '393669371775',
})

export const auth = getAuth()
const sendPasswordResetEmailFunc = (email: string) =>
  sendPasswordResetEmail(auth, email)
export { sendPasswordResetEmailFunc as sendPasswordResetEmail }

export const firestore = getFirestore()
export const storage = getStorage()

let isSigningUp = false

let onAuthStateChangedCallback: (user: User | null) => void

auth.onAuthStateChanged(async (user) => {
  !isSigningUp && onAuthStateChangedCallback(user)
})

export const setOnAuthStateChangedCallback = (
  callback: (user: User | null) => void
) => {
  onAuthStateChangedCallback = callback
}

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

export const fetchTopPosters = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(firestore, 'users'), orderBy('posts', 'desc'), limit(10))
    )

    const users = []

    for (const doc of querySnapshot.docs) {
      users.push(createUserObject(doc))
    }

    return users
  } catch (error) {
    console.error(error)
  }
}
