import type { QueryDocumentSnapshot } from 'firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'

import userCache from './user-cache'

import { firestore } from '.'

export type User = {
  createdAt: Date
  gravatar: string
  id: string
  posts: number
  username: string
}

export function createUserObject(doc: QueryDocumentSnapshot<any>): User {
  const data = doc.data()

  return data
    ? { ...data, createdAt: data.createdAt.toDate(), username: doc.id }
    : data
}

export async function fetchUser(id: string) {
  if (!Object.values(userCache.getAll()).find((user) => user.id === id)) {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, 'users'), where('id', '==', id), limit(1)),
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

export async function fetchUserByUsername(username: string) {
  if (!userCache.getAll()[username]) {
    const docRef = await getDoc(doc(firestore, 'users', username))

    const user = createUserObject(docRef)

    if (user) {
      userCache.set(user.username, user)
    }
  }

  return userCache.getAll()[username]
}
