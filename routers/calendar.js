import { Router } from 'express'
import * as calendar from '../controllers/calendar.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', auth.jwt, auth.admin, upload, calendar.create)
router.get('/', calendar.get)
router.patch('/:id', auth.jwt, auth.admin, upload, calendar.edit)

export default router
