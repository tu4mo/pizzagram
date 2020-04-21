import { firestore } from '.'
import { currentUser, getUser } from './user'

const commentsCollection = firestore.collection('comments')

export const getComments = async (postId: string) => {
  const user = currentUser()

  if (!user) {
    return
  }

  const querySnapshot = await commentsCollection
    .orderBy('createdAt', 'asc')
    .where('postId', '==', postId)
    .get()

  const comments = []

  for await (const doc of querySnapshot.docs) {
    const data = doc.data()
    const from = await getUser(data.userId)
    comments.push({
      ...data,
      createdAt: data.createdAt.toDate(),
      userId: from,
    })
  }

  return comments
}
