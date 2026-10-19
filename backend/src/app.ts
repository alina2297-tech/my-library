import express from 'express'
import cors from 'cors'

import storageRoutes from './routes/storage.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/storage', storageRoutes)

export default app