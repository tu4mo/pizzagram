import type { User } from './user'

function createUserCache() {
  const cache: { [key: string]: User } = {}

  return {
    getAll() {
      return cache
    },
    set(username: string, user: User) {
      cache[username] = user
    },
  }
}

export const userCache = createUserCache()
