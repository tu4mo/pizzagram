import type * as admin from 'firebase-admin'
import { Storage } from '@google-cloud/storage'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

const storage = new Storage()

export async function deletePost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const { id } = snap
  const { userId } = snap.data()

  const likes = db.collection('likes')
  const notifications = db.collection('notifications')

  const bucket = storage.bucket('pizzagram-cc.appspot.com')
  const photoFile = bucket.file(`posts/${id}.jpg`)
  const thumbnailFile = bucket.file(`posts/${id}_t.jpg`)

  const users = db.collection('users')

  try {
    await photoFile.delete()
    await thumbnailFile.delete()

    console.log(`${photoFile.name} and ${thumbnailFile.name} removed.`)

    const deleteBatch = db.batch()

    const likesSnapshot = await likes.where('postId', '==', id).get()
    likesSnapshot.forEach((doc) => {
      deleteBatch.delete(likes.doc(doc.id))
    })

    const notificationsSnapshot = await likes.where('postId', '==', id).get()
    notificationsSnapshot.forEach((doc) => {
      deleteBatch.delete(notifications.doc(doc.id))
    })

    await deleteBatch.commit()

    console.log(
      `Removed ${likesSnapshot.size} likes and ${notificationsSnapshot.size} notifications.`,
    )

    const usersSnapshot = await users.where('id', '==', userId).limit(1).get()

    usersSnapshot.forEach(async (userRef) => {
      const posts = userRef.data().posts - 1
      await users.doc(userRef.id).update({ posts })
      console.log(`Decreasing ${userRef.id}'s posts count to ${posts}`)
    })
  } catch (error) {
    console.log(`Failed to completely remove post (${error}).`)
  }
}
