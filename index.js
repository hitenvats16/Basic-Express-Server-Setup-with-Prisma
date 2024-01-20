import express from 'express'
import morgan from 'morgan'

import { ENV_TYPE, PORT } from './config.js'
import authRouter from './routes/auth.router.js'

const app = express()

app.use(express.json())

if (ENV_TYPE === 'dev') {
  app.use(morgan('dev'))
}

app.use('/v1/auth',authRouter)

app.listen(PORT)
