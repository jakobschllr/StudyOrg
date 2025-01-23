import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
const app = express()
app.use(
    express.static(path.resolve('dist'), {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css')
        }
      },
    })
  )
app.use(express.json()) // middleware for parsing incoming requests
app.use(cors())

export default app