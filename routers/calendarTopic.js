import { Router } from 'express'
import * as calendarTopic from '../controllers/CalendarTopic.js'

import * as auth from '../middlewares/auth.js'

const router = Router()

// 需要登入 所以要做jwt驗證
router.post('/', auth.jwt, calendarTopic.create)
router.patch('/:id', auth.jwt, calendarTopic.reply)
router.get('/', calendarTopic.get)

export default router
