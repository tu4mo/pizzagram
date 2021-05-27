import { getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore'

import { firestore } from '.'
import { currentUser } from './user'

export const toggleLike = async (postId: string) => {
  const user = currentUser()

  if (!user) {
    return
  }

  const likeDoc = doc(firestore, 'likes', `${user.uid}_${postId}`)
  const snapshot = await getDoc(likeDoc)

  if (snapshot.exists()) {
    await deleteDoc(likeDoc)
  } else {
    await setDoc(likeDoc, { postId, userId: user.uid })
  }
}
