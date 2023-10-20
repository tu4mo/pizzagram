import type { DocumentSnapshot, QueryConstraint } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions'

import { firestore, functions, storage } from '.'
import { currentUser } from './auth'

const storageRef = ref(storage)
const postsCollection = collection(firestore, 'posts')

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

export const QUERY_LIMIT = 9

export type PostComment = {
  comment: string
  id: string
  userId: string
  username: string
}

export type Post = {
  caption: string
  comments?: PostComment[]
  createdAt: Date
  doc: DocumentSnapshot<any>
  id: string
  imageUrl: string
  likes: { [key: string]: boolean }
  published: boolean
  userId: string
}

export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  const q = query(
    postsCollection,
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    limit(QUERY_LIMIT),
  )

  return onSnapshot(q, async (querySnapshot) => {
    callback(querySnapshot.docs.map(createPostObject))
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
  ].filter(Boolean) as QueryConstraint[]

  const querySnapshot = await getDocs(query(postsCollection, ...queryOperators))
  return querySnapshot.docs.map(createPostObject)
}

export const fetchPost = async (id: string) => {
  try {
    const docRef = await getDoc(doc(firestore, 'posts', id))
    return createPostObject(docRef)
  } catch (error) {
    console.error(error)
  }
}

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
}: {
  caption: string
  file: File
}) => {
  const user = await currentUser()

  if (!user) {
    return
  }

  const docRef = await addDoc(postsCollection, {
    caption,
    createdAt: serverTimestamp(),
    imageUrl: null,
    published: false,
    userId: user.uid,
  })

  const uploadTask = await uploadBytes(
    ref(storageRef, `posts/${docRef.id}.jpg`),
    file,
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

export const likePost = async (postId: string) => {
  const user = await currentUser()

  if (!user) {
    return
  }

  const likeDoc = doc(firestore, 'likes', `${user.uid}_${postId}`)
  await setDoc(likeDoc, { postId, userId: user.uid })

  const postDoc = doc(firestore, 'posts', postId)
  await updateDoc(postDoc, { [`likes.${user.uid}`]: true })
}

export const dislikePost = async (postId: string) => {
  const user = await currentUser()

  if (!user) {
    return
  }

  const likeDoc = doc(firestore, 'likes', `${user.uid}_${postId}`)
  const snapshot = await getDoc(likeDoc)

  if (snapshot.exists()) {
    await deleteDoc(likeDoc)
  }

  const postDoc = doc(firestore, 'posts', postId)
  await updateDoc(postDoc, { [`likes.${user.uid}`]: deleteField() })
}

export const verifyImage = async (image: string) => {
  const verifyImage = httpsCallable<{ image: string }, boolean>(
    functions,
    'verifyimage',
  )
  const result = await verifyImage({ image })
  return result
}

export const cropImage = (
  fileResult: string,
  outputSize: number,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      let newWidth, newHeight, xOffset, yOffset

      const aspectRatio = image.width / image.height

      if (aspectRatio > 1) {
        newHeight = outputSize
        newWidth = newHeight * aspectRatio
        xOffset = -Math.abs((outputSize - newWidth) / 2)
        yOffset = 0
      } else {
        newWidth = outputSize
        newHeight = newWidth / aspectRatio
        xOffset = 0
        yOffset = -Math.abs((outputSize - newHeight) / 2)
      }

      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight)

      const croppedImage = canvas.toDataURL('image/jpeg')
      resolve(croppedImage)
    }

    image.onerror = (err) => reject(err)
    image.src = fileResult
  })
