import { db } from './db'

export async function updatePostsCount(userId: string) {
  const documentData = await db
    .collection('posts')
    .where('imageUrl', '!=', null)
    .where('userId', '==', userId)
    .count()
    .get()

  const postsCount = documentData.data().count

  await db.collection('users_2').doc(userId).update({ postsCount })

  console.log(`Updated user's (${userId}) posts count to ${postsCount}`)
}
