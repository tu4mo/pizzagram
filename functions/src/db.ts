import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()

export const db = getFirestore()

db.settings({ timestampsInSnapshots: true })

export const comments = db.collection('comments')
export const feeds = db.collection('feeds')
export const likes = db.collection('likes')
export const notifications = db.collection('notifications')
export const posts = db.collection('posts')
export const users = db.collection('users_2')
