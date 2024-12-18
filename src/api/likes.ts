import {
  collection,
  deleteField,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'

import { getCurrentUser } from './auth'
import { postsCollection } from './posts'

import { firestore } from '.'

const likesCollection = collection(firestore, 'likes')

export async function likePost(postId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  await runTransaction(firestore, (transaction) => {
    const likeDoc = doc(likesCollection, `${user.uid}_${postId}`)
    transaction.set(likeDoc, {
      postId,
      userId: user.uid,
    })

    const postDoc = doc(postsCollection, postId)
    transaction.update(postDoc, {
      [`likes.${user.uid}`]: true,
      updatedAt: serverTimestamp(),
    })

    return Promise.resolve()
  })
}

export async function dislikePost(postId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  await runTransaction(firestore, async (transaction) => {
    const likeDoc = doc(likesCollection, `${user.uid}_${postId}`)
    const snapshot = await transaction.get(likeDoc)

    if (snapshot.exists()) {
      transaction.delete(likeDoc)
    }

    const postDoc = doc(postsCollection, postId)
    transaction.update(postDoc, {
      [`likes.${user.uid}`]: deleteField(),
      updatedAt: serverTimestamp(),
    })
  })
}
