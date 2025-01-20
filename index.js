import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import routerUser from './routers/user.js'
import './passport.js'

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

app.use(express.json())
app.use((error, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    succsee: false,
    message: '請求格式錯誤',
  })
})

app.use('/user', routerUser)

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
