import { Schema, model } from 'mongoose'

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
      // type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: [true, '照片必傳'],
    },
    tags: {
      type: [String],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('posts', schema)
