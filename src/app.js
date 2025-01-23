import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

dotenv.config()
const app = express()
app.use(express.static(resolve(__dirname, '../dist'))) // frontend build
app.use(express.json()) // middleware for parsing incoming requests
app.use(cors())

export default app