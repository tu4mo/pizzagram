import {
  QueryDocumentSnapshot,
  collection,
  where,
  limit,
  getDoc,
  doc,
  getDocs,
  query,
} from 'firebase/firestore'

import { firestore } from '.'
import userCache from './user-cache'

export const createUserObject = (doc: QueryDocumentSnapshot<any>) => {
  const data = doc.data()

  return data
    ? { ...data, createdAt: data.createdAt.toDate(), username: doc.id }
    : data
}

export const fetchUser = async (id: string) => {
  if (!Object.values(userCache.getAll()).find((user) => user.id === id)) {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, 'users'), where('id', '==', id), limit(1))
      )

      const doc = querySnapshot.docs[0]
      const user = createUserObject(doc)

      if (user) {
        userCache.set(user.username, user)
      }
    } catch (error) {
      console.error(`Unable to get user ${id}`, error)
    }
  }

  return Object.values(userCache.getAll()).find((user) => user.id === id)
}

export const fetchUserByUsername = async (username: string) => {
  if (!userCache.getAll()[username]) {
    const docRef = await getDoc(doc(firestore, 'users', username))

    const user = createUserObject(docRef)

    if (user) {
      userCache.set(user.username, user)
    }
  }

  return userCache.getAll()[username]
}
