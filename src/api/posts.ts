import type { DocumentData, DocumentSnapshot } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { getCurrentUser } from './auth'

import { firestore, functions, storage } from '.'

export const postsCollection = collection(firestore, 'posts')

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

const QUERY_LIMIT = 9

export type Post = {
  caption: string
  commentsCount: number
  createdAt: Date
  doc: DocumentSnapshot<any>
  id: string
  imageUrl: string
  likes: { [key: string]: boolean }
  published: boolean
  updatedAt: Date
  userId: string
}

const sessionStartDate = new Date()

export function subscribeToPosts(callback: (posts: Post[]) => void) {
  const q = query(
    postsCollection,
    where('published', '==', true),
    where('updatedAt', '>', sessionStartDate),
  )

  return onSnapshot(q, async (querySnapshot) => {
    callback(querySnapshot.docs.map(createPostObject))
  })
}

let isLastPostFetched = false

export async function fetchPosts(after?: DocumentSnapshot<unknown>) {
  if (after && isLastPostFetched) {
    return []
  }

  const queryOperators = [
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    limit(QUERY_LIMIT),
    after ? startAfter(after) : undefined,
  ].filter((operator) => operator !== undefined)

  const querySnapshot = await getDocs(query(postsCollection, ...queryOperators))

  if (querySnapshot.size < QUERY_LIMIT) {
    isLastPostFetched = true
  }

  return querySnapshot.docs.map(createPostObject)
}

export async function fetchPost(id: string) {
  try {
    const docRef = await getDoc(doc(postsCollection, id))
    return createPostObject(docRef)
  } catch (error) {
    console.error(error)
  }
}

function createPostObject(doc: DocumentSnapshot<any>): Post {
  const data: DocumentData = doc.data() ?? {}

  return {
    caption: data.caption ?? '',
    commentsCount: data.commentsCount ?? 0,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    doc,
    id: doc.id,
    imageUrl: data.imageUrl ?? '',
    likes: data.likes ?? {},
    published: data.published ?? false,
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
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
    throw new Error('User not found')
  }

  const docRef = await addDoc(postsCollection, {
    caption,
    createdAt: serverTimestamp(),
    imageUrl: null,
    published: false,
    updatedAt: serverTimestamp(),
    userId: user.uid,
  })

  const uploadTask = await uploadBytes(
    ref(storage, `posts/${docRef.id}.jpg`),
    file,
  )

  const downloadUrl = await getDownloadURL(uploadTask.ref)

  await updateDoc(docRef, {
    imageUrl: downloadUrl,
    published: true,
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function removePost(id: string) {
  await deleteDoc(doc(postsCollection, id))
}

export async function verifyImage(image: string) {
  const verifyImage = httpsCallable<{ image: string }, boolean>(
    functions,
    'verifyImage',
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
