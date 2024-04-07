import { posts, users } from './db'

export async function updatePostsCount(userId: string) {
  const documentData = await posts
    .where('imageUrl', '!=', null)
    .where('userId', '==', userId)
    .count()
    .get()

  const postsCount = documentData.data().count

  await users.doc(userId).update({ postsCount })

  console.log(`Updated user's (${userId}) posts count to ${postsCount}`)
}
