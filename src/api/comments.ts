import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

import { getCurrentUser } from './auth'

import { firestore } from '.'

const commentsCollection = collection(firestore, 'comments')

export type Comment = {
  comment: string
  createdAt: Date
  postId: string
  userId: string
}

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
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  await addDoc(commentsCollection, {
    comment,
    postId,
    userId: user.uid,
  })
}
