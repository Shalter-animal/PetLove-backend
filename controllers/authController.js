const User = require('../models/User');
const Pet = require('../models/Pet');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(409).json({
        success: false,
        message: 'Email is already in use'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {

    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('noticesFavorites');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
      noticesFavorites: user.noticesFavorites || []
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getMeFull = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('noticesFavorites')
      .populate('noticesViewed')
      .populate('pets');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      token: token,
      noticesViewed: user.noticesViewed || [],
      noticesFavorites: user.noticesFavorites || [],
      pets: user.pets || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

  } catch (error) {
    console.error('Get full user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Edit user profile
exports.editUser = async (req, res, next) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const userId = req.user._id;

    // Перевірка чи email вже використовується іншим користувачем
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with such an email is already exist'
        });
      }
    }

    // Оновлення користувача
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, avatar },
      { new: true, runValidators: true }
    )
      .populate('noticesViewed')
      .populate('noticesFavorites')
      .populate('pets');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const token = generateToken(updatedUser._id);

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      token: token,
      noticesViewed: updatedUser.noticesViewed || [],
      noticesFavorites: updatedUser.noticesFavorites || [],
      pets: updatedUser.pets || [],
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });

  } catch (error) {
    console.error('Edit user error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Bad request (invalid request body)',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add pet
exports.addPet = async (req, res, next) => {
  try {
    const { name, title, imgURL, species, birthday, sex } = req.body;
    const userId = req.user._id;

    // Створення нового pet
    const newPet = await Pet.create({
      name,
      title,
      imgURL,
      species,
      birthday,
      sex,
      user: userId
    });

    // Додавання pet до користувача
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { pets: newPet._id } },
      { new: true }
    )
      .populate('noticesViewed')
      .populate('noticesFavorites')
      .populate('pets');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const token = generateToken(updatedUser._id);

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      token: token,
      noticesViewed: updatedUser.noticesViewed || [],
      noticesFavorites: updatedUser.noticesFavorites || [],
      pets: updatedUser.pets || [],
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });

  } catch (error) {
    console.error('Add pet error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Bad request (invalid request body)',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Remove pet
exports.removePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Перевірка валідності ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'This id is not valid'
      });
    }

    // Знайти pet
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'This pet is not found'
      });
    }

    // Перевірка чи користувач є власником
    if (pet.user.toString() !== userId.toString()) {
      return res.status(409).json({
        success: false,
        message: "You aren't owner of this pet"
      });
    }

    // Видалення pet
    await Pet.findByIdAndDelete(id);

    // Видалення pet з користувача
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { pets: id } },
      { new: true }
    )
      .populate('noticesViewed')
      .populate('noticesFavorites')
      .populate('pets');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const token = generateToken(updatedUser._id);

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      token: token,
      noticesViewed: updatedUser.noticesViewed || [],
      noticesFavorites: updatedUser.noticesFavorites || [],
      pets: updatedUser.pets || [],
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });

  } catch (error) {
    console.error('Remove pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
