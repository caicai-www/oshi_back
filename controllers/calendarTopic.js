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
