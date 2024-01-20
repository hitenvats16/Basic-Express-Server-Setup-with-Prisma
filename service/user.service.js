import db from '../models/index.js'
import { upsertUser } from '../models/user.js'

export async function checkAndCreateUser({
  email,
  name,
  profilePicture,
  authPlatform,
}) {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  })
  if (user && user.authPlatform !== authPlatform) {
    return {
      error: {
        userLareadyExists: true,
        authPlatform: user.authPlatform,
      },
      data: null,
    }
  }
  const newUser = await upsertUser({
    email,
    name,
    profilePicture,
    authPlatform,
  })
  return {
    error: null,
    data: newUser,
  }
}
