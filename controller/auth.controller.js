import { AuthPlatform } from '@prisma/client'
import axios, { HttpStatusCode } from 'axios'
import Joi from 'joi'
import qs from 'node:querystring'
import jwt from 'jsonwebtoken'

import { AUTH_PLATFORMS } from '../constants/platforms.constants.js'
import { ENCRYPTION, GOOGLE_VARS } from '../config.js'
import { createErrorObject } from '../utils/error.utils.js'
import { checkAndCreateUser } from '../service/user.service.js'

export async function PlatformAuthController(req, res) {
  const { slug: platform } = req.params
  const schema = Joi.object({
    redirectUri: Joi.string().uri().required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.status(HttpStatusCode.BadRequest).json(createErrorObject(error))
  }
  const { redirectUri } = value
  switch (platform) {
    case AUTH_PLATFORMS.GOOGLE:
      const authOptions = {
        access_type: 'offline',
        scope: GOOGLE_VARS.SCOPES.join(' '),
        redirect_uri: redirectUri,
        response_type: 'code',
        client_id: GOOGLE_VARS.CLIENT_ID,
        prompt: 'consent',
      }
      return res.status(HttpStatusCode.TemporaryRedirect).json({
        location: `${GOOGLE_VARS.AUTH_URL}?${qs.stringify(authOptions)}`,
      })
  }
}

export async function PlatformCallbackController(req, res) {
  const { slug: platform } = req.params
  const schema = Joi.object({
    authCode: Joi.string().required(),
    redirectUri: Joi.string().uri().required(),
  })
  const { value, error } = schema.validate(req.body)
  if (error) {
    return res.status(HttpStatusCode.BadRequest).json(createErrorObject(error))
  }
  const { authCode, redirectUri } = value
  switch (platform) {
    case AUTH_PLATFORMS.GOOGLE:
      const payload = {
        code: authCode,
        client_id: GOOGLE_VARS.CLIENT_ID,
        client_secret: GOOGLE_VARS.SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }
      try {
        const { data } = await axios.post(
          GOOGLE_VARS.TOKEN_ENDPOINT,
          qs.stringify(payload),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        const profile = jwt.decode(data.id_token)
        const { data: newUser, error } = await checkAndCreateUser({
          email: profile.email,
          name: profile.name,
          profilePicture: profile.picture,
          authPlatform: AuthPlatform.GOOGLE
        })
        if(error){
          res.status(HttpStatusCode.BadRequest).json(error)
        }
        const user = {
          name: newUser.name,
          email: newUser.email,
          profilePicture: newUser.profilePicture
        }
        const token = jwt.sign(user,ENCRYPTION.KEY)
        return res.json({
          user,
          token
        })
      } catch (e) {
        return res.status(HttpStatusCode.ServiceUnavailable).json(
          createErrorObject({
            name: e.response.data.error,
            details: e.response.data.error_description,
            message: 'code is expired',
          })
        )
      }
  }
}
