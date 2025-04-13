import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'

import { firestore } from './firebase'

export type Feed = {
  caption: string
  id: string
  imageUrl: string
}[]

const feedsCollection = collection(firestore, 'feeds')

function parseFeedData(data: unknown = '[]'): Feed {
  if (typeof data !== 'string') {
    return []
  }

  const json = JSON.parse(data)

  if (!Array.isArray(json)) {
    return []
  }

  return json.map((item) => ({
    caption: item.caption ?? '',
    id: item.id,
    imageUrl: item.imageUrl ?? '',
  }))
}

export async function fetchFeed(userId: string) {
  const docRef = await getDoc(doc(feedsCollection, userId))
  return parseFeedData(docRef.data()?.json)
}

export function subscribeToFeed(
  userId: string,
  callback: (feed: Feed) => void,
) {
  return onSnapshot(doc(feedsCollection, userId), (snapshot) => {
    callback(parseFeedData(snapshot.data()?.json))
  })
}
