import { Router } from 'express'
import * as user from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', user.create)
router.post('/login', auth.login, user.login)
router.get('/', user.get)
// 增加收藏文章
router.get('/favorites', auth.jwt, user.getFavorites)
router.patch('/favorites', auth.jwt, user.toggleFavorites)

// 增加活動月曆
router.get('/calendar', auth.jwt, user.getCalendar)
router.patch('/calendar', auth.jwt, user.toggleCalendar)

router.get('/profile', auth.jwt, user.profile)
router.get('/info', auth.jwt, user.getIdInfo)
router.patch('/:id', auth.jwt, upload, user.edit)
router.patch('/refresh', auth.jwt, user.refresh)
router.delete('/logout', auth.jwt, user.logout)

export default router
