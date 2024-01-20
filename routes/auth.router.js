import { Router } from 'express'

import {
  PlatformAuthController,
  PlatformCallbackController,
} from '../controller/auth.controller.js'
import { PlatformCheckerMiddlware } from '../middleware/platform.middleware.js'

const authRouter = Router()

authRouter.post(
  '/login/:slug',
  PlatformCheckerMiddlware,
  PlatformAuthController
)

authRouter.post(
  '/login/:slug/callback',
  PlatformCheckerMiddlware,
  PlatformCallbackController
)

export default authRouter
