import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    calendar: {
      type: ObjectId,
      ref: 'posts',
      required: true,
    },
    title: {
      type: String,
      required: [true, '標題名稱必填'],
    },
    content: {
      type: String,
      required: [true, '內容必填'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('calebdarTopics', schema)
