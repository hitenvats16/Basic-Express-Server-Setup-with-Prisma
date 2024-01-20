import { HttpStatusCode } from 'axios'

import { AUTH_PLATFORMS } from '../constants/platforms.constants.js'

/**
 * This will check and ensure that only limited platform slugs will be allowed
 */
export function PlatformCheckerMiddlware(req, res, next) {
  const { slug } = req.params
  const isPresent = Object.values(AUTH_PLATFORMS).find(
    (platform) => platform === slug
  )
  if (isPresent) {
    next()
  } else {
    res.status(HttpStatusCode.NotFound).json({
      message: 'platform not supported',
    })
  }
}
