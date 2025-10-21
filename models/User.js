const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot be more than 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    avatar: {
      type: String,
      default: null
    },

    phone: {
      type: String,
      default: null,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        'Please provide a valid phone number'
      ]
    },

    noticesFavorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notice'
    }],

    noticesViewed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notice'
    }],

    pets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    }]
  },
  {
    timestamps: true
  }
);


userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);

