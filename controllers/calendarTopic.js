import { StatusCodes } from 'http-status-codes'
import calendarTopic from '../models/calendarTopic.js'

export const create = async (req, res) => {
  try {
    const result = await calendarTopic.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log('controllers. calendarTopic:', error)
    // console.log(req.body)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}

export const get = async (req, res) => {
  try {
    // console.log(req.query)
    const result = await calendarTopic
      .find({ calendar: req.query.calendar })
      .populate('user', 'name image')
      .populate('reply.user', 'name image')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log('controllers.post.get:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}

export const reply = async (req, res) => {
  try {
    console.log(req.params.id)
    console.log(req.body)

    // 確保回覆內容不為空
    if (!req.body.reply) {
      return res.status(400).json({ error: '回覆內容必填' })
    }

    const topic = await calendarTopic.findById(req.params.id)
    if (!topic) {
      return res.status(404).json({ error: '找不到該話題串' })
    }

    topic.reply.push({ user: req.body.user, reply: req.body.reply })

    await topic.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: 'user:' + req.body.user + ';' + 'reply:' + req.body.reply,
    })
    // console.log(topic)
  } catch (error) {
    console.log('controllers.calendarTopic.reply:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}
