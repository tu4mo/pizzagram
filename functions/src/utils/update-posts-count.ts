import { posts, users } from '../db.js'

import { verifyUserExists } from './verify-user-exists.js'

export async function updatePostsCount(userId: string) {
  const userExists = await verifyUserExists(userId)
  if (!userExists) {
    return
  }

  const documentData = await posts
    .where('imageUrl', '!=', null)
    .where('published', '==', true)
    .where('userId', '==', userId)
    .count()
    .get()

  const postsCount = documentData.data().count

  await users.doc(userId).update({ postsCount })

  console.log(`Updated user's (${userId}) posts count to ${postsCount}`)
}
