import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, '標題名稱必填'],
    },
    content: {
      type: String,
      required: [true, '內容必填'],
    },
    author: {
      type: ObjectId,
      ref: 'users',
      //   required: true,
    },
    image: {
      type: String,
      required: [true, '照片必傳'],
    },
    tags: {
      type: [String],
    },
    colors: {
      type: String,
      required: [true, '顏色必填'],
      enum: {
        values: ['red', 'pink', 'orange', 'blue', 'green', 'yellow', 'purple', 'white', 'black'],
        message: '顏色分類不存在',
      },
    },
    display: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('posts', schema)
