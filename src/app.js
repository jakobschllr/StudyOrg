import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


dotenv.config()
const app = express()
app.use(express.static('../dist'))
app.use(express.json())
app.use(cors())

export default app