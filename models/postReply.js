import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    post: {
      type: ObjectId,
      ref: 'posts',
      required: true,
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

export default model('postReplys', schema)
