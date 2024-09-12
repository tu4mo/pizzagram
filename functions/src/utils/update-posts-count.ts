import { posts, users } from '../db'

import { verifyUserExists } from './verify-user-exists'

export async function updatePostsCount(userId: string) {
  if (!verifyUserExists(userId)) {
    return
  }

  const documentData = await posts
    .where('imageUrl', '!=', null)
    .where('userId', '==', userId)
    .count()
    .get()

  const postsCount = documentData.data().count

  await users.doc(userId).update({ postsCount })

  console.log(`Updated user's (${userId}) posts count to ${postsCount}`)
}
