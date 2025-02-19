import { Schema, model, ObjectId } from 'mongoose'

const topicSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users',
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
})

const schema = new Schema(
  {
    start: {
      type: Date,
      required: [true, '活動開始日期必填'],
    },
    end: {
      type: Date,
      required: [true, '活動開始日期必填'],
    },
    image: {
      type: String,
      required: [true, '照片必傳'],
    },
    title: {
      type: String,
      required: [true, '活動標題必填'],
    },
    description: {
      type: String,
      required: [true, '活動敘述必填'],
    },
    location: {
      type: String,
      required: [true, '活動地點必填'],
    },
    class: {
      type: String,
    },
    topic: {
      type: [topicSchema],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('calendars', schema)
