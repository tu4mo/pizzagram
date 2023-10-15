import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

import { firestore } from '.'
import { currentUser } from './auth'
import type { Comment } from './types'

const commentsCollection = collection(firestore, 'comments')

export async function fetchComments(postId: string) {
  const querySnapshot = await getDocs(
    query(
      commentsCollection,
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
    ),
  )

  return querySnapshot.docs.map((doc) => doc.data() as Comment)
}

export async function addComment({
  comment,
  postId,
}: {
  comment: string
  postId: string
}) {
  const user = await currentUser()

  if (!user) {
    return
  }

  await addDoc(commentsCollection, {
    comment,
    postId,
    userId: user.uid,
  })
}
