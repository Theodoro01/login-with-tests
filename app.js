import express from "express"
import routes from './src/routes/routes.js'
import database from './src/database/database.js'

database.connectToDatabase()

const app = express()

app.use(express.json())
app.use('/v1', routes)

app.route('/healthcheck').get((_, res) => res.status(200).json({ msg: 'OK' }))
app.all('*', (_, res) => res.status(404).json({ message: 'Not found!' }))

export default app