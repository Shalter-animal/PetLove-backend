const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: String,
      required: [true, 'Please provide an image URL']
    },

    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },

    text: {
      type: String,
      required: [true, 'Please provide text content'],
      trim: true
    },

    date: {
      type: String,
      required: [true, 'Please provide a date']
    },

    url: {
      type: String,
      required: [true, 'Please provide a URL'],
      trim: true
    },

    id: {
      type: String,
      required: [true, 'Please provide an ID'],
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Индекс для поиска по ключевым словам
newsSchema.index({ title: 'text', text: 'text' });

module.exports = mongoose.model('News', newsSchema);

