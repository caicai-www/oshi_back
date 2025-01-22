import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import JsonWebToken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 使用 passport 的 login 驗證方式
  // passport.authenticate(驗證方式名稱, 選項, 處理的function)
  // session: false 停用 cookie
  // (error, user, info) 對應 done() 的三個東西
  passport.authenticate('login', { session: false }, (error, user, info) => {
    console.log(error, user, info)
    // 如果沒有收到資料或發生錯誤
    if (!user || error) {
      // Local 驗證策略的錯誤，缺少指定欄位的資料
      // 修改訊息為 requestFormatError
      if (info.message === 'Missing credentials') {
        info.message = 'requestFormatError'
      }
      // 對不同的訊息使用不同的狀態碼回應
      if (info.message === 'serverError') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: info.message,
        })
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: info.message,
        })
      }
    }
    // 將查詢到的登入使用者放入 req 中給後續的 controller 或 middleware 使用
    req.user = user // 將驗證後的 user 資料放到 req 中
    next() // 呼叫 next() 將請求傳遞給下一個中間件
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      if (info instanceof JsonWebToken.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          messgae: '使用者驗證錯誤',
        })
      } else if (info.message === 'severError') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: info.message,
        })
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message,
        })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
