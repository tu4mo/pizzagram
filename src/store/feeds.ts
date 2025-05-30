import { reactive } from 'vue'

import type { Feed } from '@/api/feeds'
import * as api from '@/api/feeds'

export const feedsStore = reactive<Record<string, Feed>>({})

let subscribedUserId: string | undefined
let unsubscribe: VoidFunction | undefined

export function subscribeToFeed(userId: string) {
  if (subscribedUserId === userId) {
    return
  }

  unsubscribe?.()
  subscribedUserId = userId

  unsubscribe = api.subscribeToFeed(userId, (feed) => {
    feedsStore[userId] = feed
  })
}

export function optimisticallyRemovePostFromFeed(postId: string) {
  Object.keys(feedsStore).forEach((userId) => {
    if (feedsStore[userId]) {
      feedsStore[userId] = feedsStore[userId].filter(
        (post) => post.id !== postId,
      )
    }
  })
}
