import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore/memory'
import 'firebase/storage'
import { GeoFirestore } from 'geofirestore'

import { createUserObject, currentUser } from './user'

import md5 from 'md5'

firebase.initializeApp({
  apiKey: 'AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg',
  authDomain: 'pizzagram-cc.firebaseapp.com',
  databaseURL: 'https://pizzagram-cc.firebaseio.com',
  projectId: 'pizzagram-cc',
  storageBucket: 'pizzagram-cc.appspot.com',
  messagingSenderId: '393669371775',
})

export const auth = firebase.auth()

export { firebase }
export const firestore = firebase.firestore()
export const storage = firebase.storage()

const geofirestore = new GeoFirestore(firestore)
const locations = geofirestore.collection('locations')

let isSigningUp = false

let onAuthStateChangedCallback: (user: firebase.User | null) => void

auth.onAuthStateChanged(async (user) => {
  !isSigningUp && onAuthStateChangedCallback(user)
})

export const setOnAuthStateChangedCallback = (
  callback: (user: firebase.User | null) => void
) => {
  onAuthStateChangedCallback = callback
}

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  isSigningUp = true

  const userDoc = firestore.collection('users').doc(username)

  await userDoc.set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    id: null,
  })

  await auth.createUserWithEmailAndPassword(email, password)

  const gravatar = md5(email.toLowerCase())

  const user = currentUser()

  if (!user) {
    return
  }

  await userDoc.update({ gravatar, id: user.uid })

  onAuthStateChangedCallback(user)

  isSigningUp = false
}

export const signIn = async (email: string, password: string) => {
  await auth.signInWithEmailAndPassword(email, password)
}

export const signOut = async () => {
  await auth.signOut()
}

export const getLikes = async (postId: string) => {
  try {
    const querySnapshot = await firestore
      .collection('likes')
      .where('postId', '==', postId)
      .get()

    const likes = []

    for (const doc of querySnapshot.docs) {
      likes.push(doc.data().userId)
    }

    return likes
  } catch (error) {
    console.error(error)
  }
}

export const toggleLike = async (postId: string) => {
  const user = currentUser()

  if (!user) {
    return
  }

  const doc = firestore.collection('likes').doc(`${user.uid}_${postId}`)
  const snapshot = await doc.get()

  if (snapshot.exists) {
    await doc.delete()
  } else {
    await doc.set({ postId, userId: user.uid })
  }
}

export const fetchTopPosters = async () => {
  try {
    const querySnapshot = await firestore
      .collection('users')
      .orderBy('posts', 'desc')
      .limit(10)
      .get()

    const users = []

    for (const doc of querySnapshot.docs) {
      users.push(createUserObject(doc))
    }

    return users
  } catch (error) {
    console.error(error)
  }
}

export const getNearbyLocations = async (
  latitude: number,
  longitude: number
) => {
  try {
    const query = locations.near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: 0.4,
    })

    const querySnapshot = await query.get()

    const locationsArray = []

    for (const doc of querySnapshot.docs) {
      locationsArray.push({
        id: doc.id,
        name: doc.data().name,
      })
    }

    return locationsArray
  } catch (error) {
    console.error(error)
  }
}

export const addLocation = async ({
  name,
  latitude,
  longitude,
}: {
  name: string
  latitude: number
  longitude: number
}) => {
  await locations.add({
    coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
    name: name.trim(),
  })
}
