import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import JsonWebToken from 'jsonwebtoken'
export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (!user || error) {
      if (info.message === 'Missing credentials') {
        info.message = '請求格式錯誤'
      }
      if (info.message === 'severError') {
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
