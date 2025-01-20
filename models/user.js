import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, '文章標題必填'],
    minlength: [5, '標題過短'],
    maxlength: [100, '標題過長'],
  },
  content: {
    type: String,
    required: [true, '文章內容必填'],
  },
  author: {
    type: ObjectId,
    ref: 'user', // 與用戶的關聯
    required: true,
  },
  tags: {
    type: [String], // 可選的標籤
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const collectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user', // 與用戶的關聯
    required: true,
  },
  posts: [
    {
      post: {
        type: ObjectId,
        ref: 'post', // 收藏的文章 ID
      },
      collectedAt: {
        type: Date,
        default: Date.now, // 收藏的時間
      },
    },
  ],
})

const schema = new Schema(
  {
    account: {
      type: String,
      required: [true, '使用者帳號必填'],
      minlength: [4, '使用者帳號太短'],
      maxlength: [20, '使用者帳號太長'],
      unique: true,
      validate: {
        validator(value) {
          return validator.isAlphanumeric(value)
        },
        message: '帳號格式不符',
      },
    },
    password: {
      type: String,
      required: [true, '使用者密碼必填'],
    },
    email: {
      type: String,
      required: [true, '使用者信箱必填'],
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value)
        },
        message: '使用者信箱格式不符',
      },
    },
    tokens: {
      type: [String],
    },
    role: {
      type: Number,
      default: UserRole.USER,
    },
    name: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    icon: {
      type: String,
    },
    post: {
      type: Boolean,
      default: true,
    },
    reply: {
      type: Boolean,
      default: true,
    },
    myPost: {
      type: [postSchema],
    },
    postCollection: {
      type: [collectionSchema],
    },
    // ★還要有個人行事曆
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4) {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '使用者密碼太短' }))
      next(error)
    } else if (user.password.length > 20) {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '使用者密碼太長' }))
      next(error)
    } else {
      user.password = bcrypt.hashSync(user.password, 1)
    }
  }
  next()
})
export default model('users', schema)
