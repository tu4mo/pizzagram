import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

import { firestore } from '.'
import { createUserObject } from './user'

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
