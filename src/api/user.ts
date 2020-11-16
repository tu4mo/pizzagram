import firebase from 'firebase/app'
import { auth, firestore } from '.'

import userCache from './user-cache'

export const createUserObject = (doc: firebase.firestore.DocumentSnapshot) => {
  const data = doc.data()

  return data
    ? { ...data, createdAt: data.createdAt.toDate(), username: doc.id }
    : data
}

export const initializeAuth = () =>
  new Promise<firebase.User | null>((resolve) => {
    auth.onAuthStateChanged((user) => {
      resolve(user)
    })
  })

export const getUser = async (id: string) => {
  if (!Object.values(userCache.getAll()).find((user) => user.id === id)) {
    try {
      const querySnapshot = await firestore
        .collection('users')
        .where('id', '==', id)
        .limit(1)
        .get()

      const doc = querySnapshot.docs[0]
      const user = createUserObject(doc)

      if (user) {
        userCache.set(user.username, user)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return Object.values(userCache.getAll()).find((user) => user.id === id)
}

export const getUserByUsername = async (username: string) => {
  if (!userCache.getAll()[username]) {
    const docRef = await firestore.collection('users').doc(username).get()

    const user = createUserObject(docRef)

    if (user) {
      userCache.set(user.username, user)
    }
  }

  return userCache.getAll()[username]
}

export const currentUser = () => auth.currentUser
