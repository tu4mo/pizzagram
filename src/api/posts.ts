import {
  collection,
  DocumentSnapshot,
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
  QueryConstraint,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { firestore, storage } from '.'
import { currentUser } from './user'

const storageRef = ref(storage)
const postsCollection = collection(firestore, 'posts')

export const QUERY_LIMIT = 9

export const subscribeToPosts = (callback: (posts: any[]) => void) => {
  const q = query(
    postsCollection,
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    limit(QUERY_LIMIT)
  )

  return onSnapshot(q, async (querySnapshot) => {
    const posts: any[] = []
    querySnapshot.forEach((doc) => posts.push(createPostObject(doc)))
    callback(posts)
  })
}

export const getPosts = async ({
  userId,
  after,
}: { userId?: string; after?: DocumentSnapshot<unknown> } = {}) => {
  const queryOperators = [
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    userId ? where('userId', '==', userId) : limit(QUERY_LIMIT),
    after ? startAfter(after) : undefined,
  ].filter((item): item is QueryConstraint => !!item)

  const posts: any[] = []

  const querySnapshot = await getDocs(query(postsCollection, ...queryOperators))
  querySnapshot.docs.forEach((doc) => posts.push(createPostObject(doc)))

  return posts
}

export const getPost = async (id: string) => {
  try {
    const docRef = await getDoc(doc(firestore, 'posts', id))
    return createPostObject(docRef)
  } catch (error) {
    console.error(error)
  }
}

const createPostObject = (doc: DocumentSnapshot<any>) => {
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
