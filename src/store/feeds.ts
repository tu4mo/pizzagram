import { reactive } from 'vue'

export const feedsStore = reactive<{
  feeds: { [feed: string]: { [postId: string]: boolean } }
}>({
  feeds: {},
})

export const addToFeed = (feed: string, postId: string) => {
  feedsStore.feeds = {
    ...feedsStore.feeds,
    [feed]: {
      ...(feedsStore.feeds[feed] ?? {}),
      [postId]: true,
    },
  }
}
