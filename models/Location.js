const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    useCounty: {
      type: String,
      default: '0'
    },

    stateEn: {
      type: String,
      required: [true, 'Please provide state in English']
    },

    cityEn: {
      type: String,
      required: [true, 'Please provide city in English']
    },

    countyEn: {
      type: String
    },

    stateUa: {
      type: String
    },

    cityUa: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Location', locationSchema);

