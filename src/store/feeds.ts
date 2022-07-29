import { reactive } from 'vue'

export const feedsStore = reactive({
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
