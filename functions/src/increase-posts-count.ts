import { FieldValue } from 'firebase-admin/firestore'

import { db } from './db'

export async function increasePostsCount(userId: string) {
  await db
    .collection('users_2')
    .doc(userId)
    .update({ postsCount: FieldValue.increment(1) })

  console.log(`Increased ${userId}'s posts count by 1`)
}
