import User from '../models/user.js'
import Post from '../models/post.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    await User.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '使用者帳號或信箱重複',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器錯誤',
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        role: req.user.role,
      },
    })
  } catch (error) {
    console.log('controllers.user.login:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}
export const get = async (req, res) => {
  try {
    const result = await User.find()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log('controllers.user.get:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}

export const profile = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      account: req.user.account,
      role: req.user.role,
      id: req.user.id,
      post: req.user.post,
      reply: req.user.reply,
      favorite: req.user.favorite,
    },
  })
}

export const refresh = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token,
    })
  } catch (error) {
    console.log('controller.user.refresh:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}

export const logout = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token)
    req.user.tokens.splice(idx, 1)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log('controller.user.logout:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}

export const getIdInfo = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      image: req.user.image,
      name: req.user.name,
      birthdate: req.user.birthdate,
    },
  })
}

export const edit = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    req.body.image = req.file?.path
    // console.log(req.body)
    const result = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    }).orFail(new Error('NOT FOUND'))
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log('user.edit', error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '用戶無效',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無用戶',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器錯誤',
      })
    }
  }
}

export const getFavorites = async (req, res) => {
  try {
    const result = await User.findById(req.user._id, 'favorite').populate('favorite.post')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.favorite,
    })
  } catch (error) {
    console.log('controller.user.getFavorites:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器錯誤',
    })
  }
}

export const addFavorites = async (req, res) => {
  try {
    // 檢查文章ID
    // console.log(req.body)
    if (!validator.isMongoId(req.body.post)) throw new Error('ID')
    const idx = req.user.favorite.findIndex((item) => item.post.toString() === req.body.post)
    if (idx > -1) {
      // 更新收藏的貼文
      req.user.favorite[idx] = { post: req.body.post, ...req.body.update }
    } else {
      const post = await Post.findById(req.body.post).orFail(new Error('NOT FOUND'))
      req.user.favorite.push({ post: post._id })
    }

    await req.user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.favorite,
    })
  } catch (error) {
    console.log('controller.user.addFavorites:', error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的貼文ID',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無貼文',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器錯誤',
      })
    }
  }
}
