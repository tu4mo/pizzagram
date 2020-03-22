import { firebase, firestore, storage } from '.'
import { currentUser } from './user'

const storageRef = storage.ref()

export const QUERY_LIMIT = 9

export const subscribeToPosts = (callback: (posts: any[]) => void) =>
  firestore
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .where('published', '==', true)
    .limit(QUERY_LIMIT)
    .onSnapshot((querySnapshot) => {
      const posts: any[] = []
      querySnapshot.forEach((doc) => posts.push(createPostObject(doc)))
      callback(posts)
    })

export const getPosts = async ({
  userId,
  startAfter,
}: { userId?: string; startAfter?: any } = {}) => {
  let query = firestore
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .where('published', '==', true)

  if (userId) {
    query = query.where('userId', '==', userId)
  } else {
    query = query.limit(QUERY_LIMIT)
  }

  if (startAfter) {
    query = query.startAfter(startAfter)
  }

  const querySnapshot = await query.get()

  const posts: any[] = []

  querySnapshot.docs.forEach((doc) => posts.push(createPostObject(doc)))

  return posts
}

export const getPost = async (id: string) => {
  try {
    const docRef = await firestore.collection('posts').doc(id).get()

    return createPostObject(docRef)
  } catch (error) {
    console.error(error)
  }
}

const createPostObject = (doc: firebase.firestore.DocumentSnapshot) => {
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

  const docRef = await firestore.collection('posts').add({
    caption,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    imageUrl: null,
    published: false,
    rating,
    latitude,
    longitude,
    location,
    userId: user.uid,
  })
  const uploadTask = await uploadFile(file, docRef.id)
  const downloadUrl = await uploadTask.ref.getDownloadURL()

  await docRef.update({
    imageUrl: downloadUrl,
    published: true,
  })

  return docRef.id
}

const uploadFile = async (file: File, id: string) => {
  const uploadTask = storageRef.child('posts').child(`${id}.jpg`).put(file)

  return uploadTask
}

export const removePost = async (id: string) => {
  await firestore.collection('posts').doc(id).delete()
}
