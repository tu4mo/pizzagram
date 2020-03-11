import { firestore } from '.'
import { currentUser, getUser } from './user'

const collection = firestore.collection('notifications')

export const subscribeToNotifications = (
  callback: (notifications: any[]) => void
) => {
  const user = currentUser()

  if (!user) {
    return
  }

  return collection
    .orderBy('createdAt', 'desc')
    .where('userId', '==', user.uid)
    .where('read', '==', false)
    .onSnapshot(async querySnapshot => {
      const notifications = []

      for await (const doc of querySnapshot.docs) {
        const data = doc.data()
        const from = await getUser(data.fromUserId)
        notifications.push({
          ...data,
          createdAt: data.createdAt.toDate(),
          from
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

  const notifications = await collection
    .where('userId', '==', user.uid)
    .where('read', '==', false)
    .get()

  const batch = firestore.batch()

  notifications.docs.forEach(async doc => {
    const notification = collection.doc(doc.id)
    batch.update(notification, { read: true })
  })

  await batch.commit()
}
