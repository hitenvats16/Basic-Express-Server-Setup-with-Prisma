export const PORT = process.env.PORT ?? 8080
export const ENV_TYPE = process.env.ENV_TYPE ?? 'dev'

export const GOOGLE_VARS = {
  SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  SCOPES: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  TOKEN_ENDPOINT: 'https://oauth2.googleapis.com/token',
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth'
}

export const ENCRYPTION = {
  KEY: process.env.JWT_KEY_SECRET ?? 'key',
}