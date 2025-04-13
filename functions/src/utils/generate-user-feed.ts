import { feeds, posts as postsCollection } from '../db'

import { verifyUserExists } from './verify-user-exists'

export async function generateUserFeed(userId: string) {
  const userExists = await verifyUserExists(userId)
  if (!userExists) {
    return
  }

  const posts = await postsCollection
    .where('published', '==', true)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  const feedPosts = posts.docs.map((post) => {
    const postData = post.data()

    return {
      caption: postData.caption,
      id: post.id,
      imageUrl: postData.thumbnailUrl,
    }
  })

  await feeds.doc(userId).set({ json: JSON.stringify(feedPosts) })

  console.log(`Feed saved for user ${userId}`)
}
