import type { DocumentSnapshot, QueryConstraint } from 'firebase/firestore'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  startAfter,
  setDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { firestore, storage } from '.'
import { currentUser } from './auth'

const storageRef = ref(storage)
const postsCollection = collection(firestore, 'posts')

export const QUERY_LIMIT = 9

export type Post = {
  caption: string
  createdAt: Date
  doc: DocumentSnapshot<any>
  id: string
  imageUrl: string
  latitude: number | null
  likes: string[]
  location: string
  longitude: number | null
  published: boolean
  rating: number
  userId: string
}

export const subscribeToPosts = (
  // eslint-disable-next-line no-unused-vars
  callback: (posts: Post[]) => void
) => {
  const q = query(
    postsCollection,
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    limit(QUERY_LIMIT)
  )

  return onSnapshot(q, async (querySnapshot) => {
    const posts: Post[] = []
    querySnapshot.forEach((doc) => posts.push(createPostObject(doc)))
    callback(posts)
  })
}

export const fetchPosts = async ({
  userId,
  after,
}: { userId?: string; after?: DocumentSnapshot<unknown> } = {}) => {
  const queryOperators = [
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    userId ? where('userId', '==', userId) : limit(QUERY_LIMIT),
    after ? startAfter(after) : undefined,
  ].filter((item): item is QueryConstraint => !!item)

  const posts: Post[] = []

  const querySnapshot = await getDocs(query(postsCollection, ...queryOperators))
  querySnapshot.docs.forEach((doc) => posts.push(createPostObject(doc)))

  return posts
}

export const fetchPost = async (id: string) => {
  try {
    const docRef = await getDoc(doc(firestore, 'posts', id))
    return createPostObject(docRef)
  } catch (error) {
    console.error(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPostObject = (doc: DocumentSnapshot<any>): Post => {
  const data = doc.data()

  return data
    ? {
        ...data,
        createdAt: data.createdAt.toDate(),
        doc,
        id: doc.id,
      }
    : data
}

export const sharePost = async ({
  caption,
  file,
  rating,
  latitude,
  longitude,
  location,
}: {
  caption: string
  file: File
  rating: number
  latitude: number
  longitude: number
  location: string
}) => {
  const user = currentUser()

  if (!user) {
    return
  }

  const docRef = await addDoc(postsCollection, {
    caption,
    createdAt: serverTimestamp(),
    imageUrl: null,
    published: false,
    rating,
    latitude,
    longitude,
    location,
    userId: user.uid,
  })

  const uploadTask = await uploadBytes(
    ref(storageRef, `posts/${docRef.id}.jpg`),
    file
  )

  const downloadUrl = await getDownloadURL(uploadTask.ref)

  await updateDoc(docRef, {
    imageUrl: downloadUrl,
    published: true,
  })

  return docRef.id
}

export const removePost = async (id: string) => {
  await deleteDoc(doc(postsCollection, id))
}

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
