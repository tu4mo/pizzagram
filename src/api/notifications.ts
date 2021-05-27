import {
  collection,
  where,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore'

import { firestore } from '.'
import { currentUser, getUser } from './user'

const notifications = collection(firestore, 'notifications')

export const subscribeToNotifications = (
  callback: (notifications: any[]) => void
) => {
  const user = currentUser()

  if (!user) {
    return
  }

  const beginningDate = Date.now() - 1000 * 60 * 60 * 24 * 90

  const q = query(
    notifications,
    orderBy('createdAt', 'desc'),
    where('userId', '==', user.uid),
    where('createdAt', '>=', new Date(beginningDate))
  )

  return onSnapshot(q, async (querySnapshot) => {
    const notifications = []

    for await (const doc of querySnapshot.docs) {
      const data: any = doc.data()
      const from = await getUser(data.fromUserId)
      notifications.push({
        ...data,
        createdAt: data.createdAt.toDate(),
        id: doc.id,
        from,
      })
    }

    callback(notifications)
  })
}

export const markNotificationsAsRead = async () => {
  const user = currentUser()

  if (!user) {
    return
  }

  const querySnapshot = await getDocs(
    query(
      notifications,
      where('userId', '==', user.uid),
      where('read', '==', false)
    )
  )

  const batch = writeBatch(firestore)

  querySnapshot.forEach(async (docRef) => {
    const notification = doc(firestore, 'notifications', docRef.id)
    batch.update(notification, { read: true })
  })

  await batch.commit()
}
