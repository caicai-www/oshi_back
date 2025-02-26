import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import routerUser from './routers/user.js'
import routerPost from './routers/post.js'
import routerPostReply from './routers/postReply.js'
import routerCalendar from './routers/calendar.js'
import routerCalendarTopic from './routers/calendarTopic.js'
import './passport.js'
import cors from 'cors'

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.log(error)
  })

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      // console.log(origin)
      if (
        origin === undefined ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('github.io')
      ) {
        callback(null, true)
      } else {
        callback(new Error('CORS'), false)
      }
    },
  }),
)

app.use(express.json())
app.use((error, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    succsee: false,
    message: '請求格式錯誤',
  })
})

app.use('/user', routerUser)
app.use('/post', routerPost)
app.use('/postReply', routerPostReply)
app.use('/calendar', routerCalendar)
app.use('/calendarTopic', routerCalendarTopic)

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
