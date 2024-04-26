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
  postsCount: number
  username: string
}

export function createUserObject(doc: QueryDocumentSnapshot<any>) {
  const data = doc.data() ?? {}

  const user: User = {
    createdAt: data.createdAt.toDate(),
    gravatar: data.gravatar ?? '',
    id: doc.id,
    postsCount: data.postsCount ?? 0,
    username: data.username ?? '',
  }

  return user
}

export async function fetchUser(id: string) {
  if (!Object.values(userCache.getAll()).find((user) => user.id === id)) {
    try {
      const docRef = await getDoc(doc(firestore, 'users_2', id))
      const user = createUserObject(docRef)

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
    const querySnapshot = await getDocs(
      query(
        collection(firestore, 'users_2'),
        where('username', '==', username),
        limit(1),
      ),
    )

    const docRef = querySnapshot.docs[0]

    if (docRef) {
      const user = createUserObject(docRef)

      if (user) {
        userCache.set(user.username, user)
      }
    }
  }

  return userCache.getAll()[username]
}
