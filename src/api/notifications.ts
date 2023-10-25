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

import { currentUser } from './auth'
import type { User } from './user'
import { fetchUser } from './user'

import { firestore } from '.'

const notifications = collection(firestore, 'notifications')

export type NotificationType = 'COMMENT' | 'LIKE'

export type Notification = {
  createdAt: Date
  from: User
  fromUserId: string
  id: string
  imageUrl: string
  postId: string
  read: boolean
  type: NotificationType
  userId: string
}

export async function subscribeToNotifications(
  callback: (notifications: Notification[]) => void,
) {
  const user = await currentUser()

  if (!user) {
    return
  }

  const beginningDate = Date.now() - 1000 * 60 * 60 * 24 * 90

  const q = query(
    notifications,
    orderBy('createdAt', 'desc'),
    where('userId', '==', user.uid),
    where('createdAt', '>=', new Date(beginningDate)),
  )

  return onSnapshot(q, async (querySnapshot) => {
    const notifications = []

    for await (const doc of querySnapshot.docs) {
      const data = doc.data()
      const from = await fetchUser(data.fromUserId)

      notifications.push({
        ...data,
        createdAt: data.createdAt.toDate(),
        id: doc.id,
        from,
      } as Notification)
    }

    callback(notifications)
  })
}

export async function markNotificationsAsRead() {
  const user = await currentUser()

  if (!user) {
    return
  }

  const querySnapshot = await getDocs(
    query(
      notifications,
      where('userId', '==', user.uid),
      where('read', '==', false),
    ),
  )

  const batch = writeBatch(firestore)

  querySnapshot.forEach(async (docRef) => {
    const notification = doc(firestore, 'notifications', docRef.id)
    batch.update(notification, { read: true })
  })

  await batch.commit()
}
