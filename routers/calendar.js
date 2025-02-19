import { Router } from 'express'
import * as calendar from '../controllers/calendar.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.get('/', calendar.get)
router.get('/:id', calendar.getId)
router.patch('/:id', auth.jwt, auth.admin, upload, calendar.edit)

export default router
