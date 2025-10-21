const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a pet name'],
      trim: true
    },

    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true
    },

    imgURL: {
      type: String,
      required: [true, 'Please provide an image URL']
    },

    species: {
      type: String,
      required: [true, 'Please provide a species'],
      enum: ['dog', 'cat', 'fish', 'bird', 'other']
    },

    birthday: {
      type: Date,
      required: [true, 'Please provide a birthday']
    },

    sex: {
      type: String,
      required: [true, 'Please provide a sex'],
      enum: ['male', 'female', 'unknown']
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pet', petSchema);

