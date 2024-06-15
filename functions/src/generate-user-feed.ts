import { posts } from './db'
import { bucket } from './storage'

export async function generateUserFeed(userId: string) {
  const userPosts = await posts
    .where('published', '==', true)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  const normalizedPosts = userPosts.docs.map((doc) => {
    const data = doc.data()

    return {
      caption: data.caption,
      id: doc.id,
      imageUrl: data.imageUrl,
    }
  })

  await bucket
    .file(`profile-feed-${userId}.json`)
    .save(JSON.stringify(normalizedPosts))
}
