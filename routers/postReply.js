import { Router } from 'express'
import * as postReply from '../controllers/postReply.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

// 需要登入 所以要做jwt驗證
router.post('/', auth.jwt, upload, postReply.create)
router.get('/', postReply.get)
// router.get('/getByPost', postReply.getByPost)

export default router
