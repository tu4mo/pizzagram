import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()

const defaultFirestore = getFirestore()

defaultFirestore.settings({ timestampsInSnapshots: true })

export { defaultFirestore as db }
