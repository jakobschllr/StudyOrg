import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.static('../dist')) // frontend build
app.use(express.json()) // middleware for parsing incoming requests
app.use(cors())

export default app