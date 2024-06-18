import { feeds, posts } from './db'

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

  await feeds.doc(userId).set({ json: JSON.stringify(normalizedPosts) })

  console.log(`Feed saved for user ${userId}`)
}
