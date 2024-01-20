import db from "./index.js";

export function upsertUser({ email, name, profilePicture, authPlatform }) {
  return db.user.upsert({
    where: {
      email,
    },
    create: {
      email,
      name,
      profilePicture,
      authPlatform,
    },
    update: {
      name,
      profilePicture,
      authPlatform
    },
  })
}
