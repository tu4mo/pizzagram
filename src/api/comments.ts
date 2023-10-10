import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'

import { firestore } from '.'

const commentsCollection = collection(firestore, 'comments')

export type Comment = {
  comment: string
  createdAt: Date
  postId: string
  userId: string
}

export const fetchComments = async (postId: string) => {
  const comments: Comment[] = []

  const querySnapshot = await getDocs(
    query(
      commentsCollection,
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
    ),
  )

  querySnapshot.docs.forEach((doc) => comments.push(doc.data() as Comment))

  return comments
}
