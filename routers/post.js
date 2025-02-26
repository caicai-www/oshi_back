import { Router } from 'express'
import * as post from '../controllers/post.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', auth.jwt, upload, post.create)
// 取到自己的貼文
router.get('/', auth.jwt, post.get)
// 隨機取貼文
router.get('/random', post.getRandom)
// 取到所有貼文
router.get('/all', post.getAll)
// 取到單個貼文
router.get('/:id', post.getId)

router.patch('/:id', auth.jwt, auth.admin, post.edit)

export default router
