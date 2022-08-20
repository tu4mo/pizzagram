import type { User } from './user'

const userCache = () => {
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

export default userCache()
