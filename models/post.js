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
      ref: 'user',
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
      required: [true, '內容必填'],
      enum: {
        values: ['red', 'pink', 'orange', 'blue', 'green', 'yellow', 'purple', 'white', 'black'],
        message: '顏色分類不存在',
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('posts', schema)
