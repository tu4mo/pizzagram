import { initializeApp } from 'firebase/app'
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
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

if (import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
  ;(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN
}

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    '6Le45JcoAAAAANUxNTA8_81bzHFYX1hOdUFs0SGV',
  ),
  isTokenAutoRefreshEnabled: true,
})

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)
