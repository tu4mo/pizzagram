import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'

import { getCurrentUser } from './auth'
import { firestore } from './firebase'
import { type User, fetchUser } from './user'

const notificationsCollection = collection(firestore, 'notifications')

export type NotificationType = 'COMMENT' | 'LIKE'

export type Notification = {
  createdAt: Date
  from: User
  fromUserId: string
  id: string
  imageUrl: string
  postId: string
  read: boolean
  to: User
  type: NotificationType
  userId: string
}

export async function subscribeToNotifications(
  callback: (notifications: Notification[]) => void,
) {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  const beginningDate = Date.now() - 1000 * 60 * 60 * 24 * 90

  const q = query(
    notificationsCollection,
    orderBy('createdAt', 'desc'),
    where('userId', '==', user.uid),
    where('createdAt', '>=', new Date(beginningDate)),
  )

  return onSnapshot(q, async (querySnapshot) => {
    const notifications: Notification[] = []

    for (const doc of querySnapshot.docs) {
      const data = doc.data()
      const from = await fetchUser(data.fromUserId)
      const to = await fetchUser(data.userId)

      if (!from || !to) {
        continue
      }

      notifications.push({
        createdAt: data.createdAt?.toDate() || new Date(),
        from,
        fromUserId: data.fromUserId ?? '',
        id: doc.id,
        imageUrl: data.imageUrl ?? '',
        postId: data.postId ?? '',
        read: data.read ?? false,
        to,
        type: data.type,
        userId: data.userId ?? '',
      })
    }

    callback(notifications)
  })
}

export async function markNotificationsAsRead() {
  const user = await getCurrentUser()

  if (!user) {
    return
  }

  const querySnapshot = await getDocs(
    query(
      notificationsCollection,
      where('userId', '==', user.uid),
      where('read', '==', false),
    ),
  )

  const batch = writeBatch(firestore)

  querySnapshot.forEach((docRef) => {
    const notification = doc(notificationsCollection, docRef.id)
    batch.update(notification, { read: true })
  })

  await batch.commit()
}
