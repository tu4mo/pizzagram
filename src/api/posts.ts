import type { DocumentSnapshot, QueryConstraint } from 'firebase/firestore'
import {
  Timestamp,
  addDoc,
  arrayUnion,
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
  runTransaction,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { getCurrentUser } from './auth'

import { firestore, functions, storage } from '.'

const storageRef = ref(storage)
const postsCollection = collection(firestore, 'posts')

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

export const QUERY_LIMIT = 9

export type PostComment = {
  comment: string
  createdAt: Date
  id: string
  userId: string
  username: string
}

export type Post = {
  caption: string
  commentsCount: number
  createdAt: Date
  doc: DocumentSnapshot<any>
  id: string
  imageUrl: string
  likes: { [key: string]: boolean }
  published: boolean
  userId: string
}

export function subscribeToPosts(callback: (posts: Post[]) => void) {
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

export async function fetchPosts({
  userId,
  after,
}: { userId?: string; after?: DocumentSnapshot<unknown> } = {}) {
  const queryOperators = [
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    userId ? where('userId', '==', userId) : limit(QUERY_LIMIT),
    after ? startAfter(after) : undefined,
  ].filter(Boolean) as QueryConstraint[]

  const querySnapshot = await getDocs(query(postsCollection, ...queryOperators))
  return querySnapshot.docs.map(createPostObject)
}

export async function fetchPost(id: string) {
  try {
    const docRef = await getDoc(doc(firestore, 'posts', id))
    return createPostObject(docRef)
  } catch (error) {
    console.error(error)
  }
}

function createPostObject(doc: DocumentSnapshot<any>): Post {
  const data = doc.data() ?? {}

  return {
    caption: data.caption ?? '',
    commentsCount: data.commentsCount ?? 0,
    createdAt: data.createdAt.toDate(),
    doc,
    id: doc.id,
    imageUrl: data.imageUrl ?? '',
    likes: data.likes ?? {},
    published: data.published ?? false,
    userId: data.userId ?? '',
  }
}

export async function sharePost({
  caption,
  file,
}: {
  caption: string
  file: File
}) {
  const user = await getCurrentUser()

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

export async function removePost(id: string) {
  await deleteDoc(doc(postsCollection, id))
}

export async function likePost(postId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  await runTransaction(firestore, async (transaction) => {
    const likeDoc = doc(firestore, 'likes', `${user.uid}_${postId}`)
    transaction.set(likeDoc, { postId, userId: user.uid })

    const postDoc = doc(firestore, 'posts', postId)
    transaction.update(postDoc, { [`likes.${user.uid}`]: true })
  })
}

export async function dislikePost(postId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  await runTransaction(firestore, async (transaction) => {
    const likeDoc = doc(firestore, 'likes', `${user.uid}_${postId}`)
    const snapshot = await transaction.get(likeDoc)

    if (snapshot.exists()) {
      transaction.delete(likeDoc)
    }

    const postDoc = doc(firestore, 'posts', postId)
    transaction.update(postDoc, { [`likes.${user.uid}`]: deleteField() })
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

  if (!user?.displayName) {
    return
  }

  const post = doc(firestore, 'posts', postId)

  const newComment = {
    comment,
    createdAt: Timestamp.now(),
    userId: user.uid,
    username: user.displayName,
  }

  console.log(newComment)

  await updateDoc(post, {
    comments: arrayUnion(newComment),
  })
}

export async function verifyImage(image: string) {
  const verifyImage = httpsCallable<{ image: string }, boolean>(
    functions,
    'verifyimage',
  )
  const result = await verifyImage({ image })
  return result
}

export async function cropImage(
  fileResult: string,
  outputSize: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
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
}
