import { Router } from 'express'
import * as user from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', user.create)
router.post('/login', auth.login, user.login)
router.get('/', user.get)
router.get('/profile', auth.jwt, user.profile)
router.patch(
  '/profile/:id',
  auth.jwt,
  (req, res) => {
    console.log('📥 PATCH API 被呼叫！')
    res.json({ message: '測試 API 進入成功', id: req.params.id })
  },
  user.edit,
)
router.patch('/refresh', auth.jwt, user.refresh)
router.delete('/logout', auth.jwt, user.logout)

export default router
