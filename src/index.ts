import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { db } from './dbconnection/db_index' 
import config from './dbconnection/dbconfig'
import userRoute from './routes/user.route'
import postRoute from './routes/post.route'

const { PORT } = config

dotenv.config()

const app = express()

app.use(express.json())
app.use(logger('dev'))

app.use('/user', userRoute)
app.use('/post', postRoute)

db.sync()
.then(() => {
    console.log('Database is connected')
})
.catch((error) => {
    console.error(error)
})

const port = PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

export default app


































