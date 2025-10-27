const mongoose = require('mongoose');

const workDaySchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  from: {
    type: String,
    default: null
  },
  to: {
    type: String,
    default: null
  }
}, { _id: true });

const friendSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
      trim: true
    },

    url: {
      type: String,
      required: [true, 'Please provide URL']
    },

    addressUrl: {
      type: String,
      required: [true, 'Please provide address URL']
    },

    imageUrl: {
      type: String,
      required: [true, 'Please provide image URL']
    },

    address: {
      type: String,
      required: [true, 'Please provide address']
    },

    workDays: {
      type: [workDaySchema],
      validate: {
        validator: function(v) {
          return v.length === 7;
        },
        message: 'workDays must contain exactly 7 days'
      }
    },

    phone: {
      type: String,
      default: null
    },

    email: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Friend', friendSchema);

