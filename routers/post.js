import { Router } from 'express'
import * as post from '../controllers/post.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', auth.jwt, upload, post.create)

export default router
