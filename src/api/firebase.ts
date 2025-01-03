import { initializeApp } from 'firebase/app'
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const app = initializeApp({
  apiKey: 'AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg',
  appId: '1:393669371775:web:7334a83ecef631ecea9c4a',
  authDomain: 'pizzagram-cc.firebaseapp.com',
  databaseURL: 'https://pizzagram-cc.firebaseio.com',
  messagingSenderId: '393669371775',
  projectId: 'pizzagram-cc',
  storageBucket: 'pizzagram-cc.appspot.com',
})

if (import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
  ;(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN
}

initializeAppCheck(app, {
  isTokenAutoRefreshEnabled: true,
  provider: new ReCaptchaEnterpriseProvider(
    '6Le45JcoAAAAANUxNTA8_81bzHFYX1hOdUFs0SGV',
  ),
})

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const functions = getFunctions(app)
