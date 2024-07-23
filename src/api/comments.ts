import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'

import { getCurrentUser } from './auth'

import { firestore } from '.'

const commentsCollection = collection(firestore, 'comments')

export type Comment = {
  comment: string
  createdAt: Date
  id: string
  postId: string
  userId: string
  username: string
}

export async function fetchComments(postId: string) {
  const querySnapshot = await getDocs(
    query(
      commentsCollection,
      where('postId', '==', postId),
      orderBy('createdAt', 'asc'),
    ),
  )

  return querySnapshot.docs.map((doc) => {
    const data = doc.data()

    const comment: Comment = {
      comment: data.comment ?? '',
      createdAt: data.createdAt.toDate(),
      id: doc.id,
      postId: data.postId ?? '',
      userId: data.userId ?? '',
      username: data.username ?? '',
    }

    return comment
  })
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
    throw new Error('User is not authenticated')
  }

  const docRef = await addDoc(commentsCollection, {
    comment,
    createdAt: serverTimestamp(),
    postId,
    userId: user.uid,
    username: user.displayName,
  })

  const newComment: Comment = {
    comment,
    createdAt: new Date(),
    id: docRef.id,
    postId,
    userId: user.uid,
    username: user.displayName ?? '',
  }

  return newComment
}
