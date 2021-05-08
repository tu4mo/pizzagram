import { firestore } from '.'
import { currentUser } from './user'

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
