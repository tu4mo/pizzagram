import { reactive } from 'vue'

export const feedsStore = reactive<{
  feeds: { [feed: string]: { [postId: string]: boolean } }
  addToFeeds: (feed: string, postId: string) => void
}>({
  feeds: {},

  addToFeeds(feed, postId) {
    this.feeds = {
      ...this.feeds,
      [feed]: {
        ...(this.feeds[feed] ?? {}),
        [postId]: true,
      },
    }
  },
})
