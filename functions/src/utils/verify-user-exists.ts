import { getAuth } from 'firebase-admin/auth'

export async function verifyUserExists(userId: string) {
  try {
    console.log(`Verifying user ${userId} exists...`)
    await getAuth().getUser(userId)
    return true
  } catch {
    console.error(`User ${userId} does not exist`)
    return false
  }
}
