import { Router } from 'express'
import * as post from '../controllers/post.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', auth.jwt, upload, post.create)
// 未登入也可以看到的
router.get('/', post.get)
// 單個商品
router.get('/:id', post.getId)

export default router
