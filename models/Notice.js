const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    species: {
      type: String,
      required: [true, 'Please provide species'],
      enum: ['dog', 'cat', 'monkey', 'bird', 'snake', 'turtle', 'lizard', 'frog', 'fish', 'ants', 'bees', 'butterfly', 'spider', 'scorpion']
    },

    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['sell', 'lost', 'found', 'free']
    },

    price: {
      type: Number,
      default: 0
    },

    title: {
      type: String,
      required: [true, 'Please provide title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },

    name: {
      type: String,
      required: [true, 'Please provide pet name'],
      trim: true
    },

    birthday: {
      type: Date,
      required: [true, 'Please provide birthday']
    },

    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },

    sex: {
      type: String,
      enum: ['unknown', 'female', 'male', 'multiple'],
      default: 'unknown'
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Please provide location']
    },

    imgURL: {
      type: String,
      default: null
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    popularity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notice', noticeSchema);

