import { Schema, model } from 'mongoose'

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
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('calendars', schema)
