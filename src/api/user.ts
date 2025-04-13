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

import { firestore } from './firebase'
import { userCache } from './user-cache'

export type User = {
  createdAt: Date
  gravatar: string
  id: string
  postsCount: number
  username: string
}

const usersCollection = collection(firestore, 'users_2')

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
      const docRef = await getDoc(doc(usersCollection, id))
      const user = createUserObject(docRef)

      userCache.set(user.username, user)
    } catch (error) {
      console.error(`Unable to get user ${id}`, error)
    }
  }

  return Object.values(userCache.getAll()).find((user) => user.id === id)
}

export async function fetchUserByUsername(username: string) {
  const cachedUsers = userCache.getAll()

  if (username in cachedUsers) {
    return cachedUsers[username]
  }

  const querySnapshot = await getDocs(
    query(usersCollection, where('username', '==', username), limit(1)),
  )

  const docRef = querySnapshot.docs[0]

  if (docRef) {
    const user = createUserObject(docRef)

    userCache.set(user.username, user)

    return user
  }
}
