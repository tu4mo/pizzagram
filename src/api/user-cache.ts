type User = {
  [key: string]: any
}

const userCache = () => {
  const cache: User = {}

  return {
    getAll() {
      return cache
    },
    set(username: string, user: any) {
      cache[username] = user
    }
  }
}

export default userCache()
