import { feeds, posts } from './db'

export async function generateUserFeed(userId: string) {
  const userPosts = await posts
    .where('published', '==', true)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  const normalizedPosts = userPosts.docs.map((doc) => {
    const data = doc.data()

    const extension = /(\.[a-z]+)\?/i.exec(data.imageUrl)?.at(1)
    const imageUrl = data.imageUrl.replace(extension, `_t${extension}`)

    return {
      caption: data.caption,
      id: doc.id,
      imageUrl,
    }
  })

  await feeds.doc(userId).set({ json: JSON.stringify(normalizedPosts) })

  console.log(`Feed saved for user ${userId}`)
}
