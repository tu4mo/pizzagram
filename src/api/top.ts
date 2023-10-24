import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'

import { firestore } from '.'
import { createUserObject } from './user'
import userCache from './user-cache'

export async function fetchTopPosters() {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestore, 'users'),
        orderBy('posts', 'desc'),
        limit(10),
      ),
    )

    const users = []

    for (const doc of querySnapshot.docs) {
      const user = createUserObject(doc)
      users.push(user)
      userCache.set(user.username, user)
    }

    return users
  } catch (error) {
    console.error(error)
  }
}
