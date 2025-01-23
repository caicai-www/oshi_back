import passport from 'passport'
import passportLocal from 'passport-local'
import User from './models/user.js'
import bcrypt from 'bcrypt'
import passportJWT from 'passport-jwt'

// passportLocal 驗證方式
passport.use(
  'login',
  new passportLocal.Strategy(
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    async (account, password, done) => {
      try {
        const user = await User.findOne({ account }).orFail(new Error('ACCOUNT'))
        if (!bcrypt.compareSync(password, user.password)) {
          throw new Error('PASSWORD')
        }
        return done(null, user, null)
      } catch (error) {
        console.log('passport.use:', error)
        if (error.message === 'ACCOUNT') {
          return done(null, null, { message: '查無此使用者' })
        } else if (error.message === 'PASSWORD') {
          return done(null, null, { message: '使用者密碼錯誤' })
        } else {
          return done(null, null, { message: '伺服器錯誤' })
        }
      }
    },
  ),
)

// passportJWT 驗證策略
passport.use(
  'jwt',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
      // 允許過期的jwt通過
      ignoreExpiration: true,
    },
    async (req, payload, done) => {
      try {
        const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)

        const expired = payload.exp * 1000 < new Date().getTime()
        const url = req.baseUrl + req.path
        if (expired && url !== '/user/refresh' && url !== '/user/logout') {
          throw new Error('EXPIRED')
        }

        const user = await User.findById(payload._id).orFail(new Error('USER'))
        if (!user.tokens.includes(token)) {
          throw new Error('TOKEN')
        }
        return done(null, { user, token }, null)
      } catch (error) {
        console.log('passportJWT:', error)
        if (error.message === 'user') {
          return done(null, null, { message: '查無使用者' })
        } else if (error.message === 'TOKEN') {
          return done(null, null, { message: '使用者驗證錯誤' })
        } else if (error.message === 'EXPIRED') {
          return done(null, null, { message: '登入過期' })
        } else {
          return done(null, null, { message: '伺服器錯誤' })
        }
      }
    },
  ),
)
