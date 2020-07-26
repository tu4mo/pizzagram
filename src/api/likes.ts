import { firestore } from '.'
import { currentUser } from './user'

export const getLikes = async (postId: string) => {
  try {
    const querySnapshot = await firestore
      .collection('likes')
      .where('postId', '==', postId)
      .get()

    const likes = []

    for (const doc of querySnapshot.docs) {
      likes.push(doc.data().userId)
    }

    return likes
  } catch (error) {
    console.error(error)
  }
}

export const toggleLike = async (postId: string) => {
  const user = currentUser()

  if (!user) {
    return
  }

  const doc = firestore.collection('likes').doc(`${user.uid}_${postId}`)
  const snapshot = await doc.get()

  if (snapshot.exists) {
    await doc.delete()
  } else {
    await doc.set({ postId, userId: user.uid })
  }
}
