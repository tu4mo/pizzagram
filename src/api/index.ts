import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const app = initializeApp({
  apiKey: 'AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg',
  authDomain: 'pizzagram-cc.firebaseapp.com',
  databaseURL: 'https://pizzagram-cc.firebaseio.com',
  projectId: 'pizzagram-cc',
  storageBucket: 'pizzagram-cc.appspot.com',
  messagingSenderId: '393669371775',
  appId: '1:393669371775:web:7334a83ecef631ecea9c4a',
})

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)
