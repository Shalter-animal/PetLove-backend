const Notice = require('../models/Notice');
const User = require('../models/User');

exports.getNotices = async (req, res) => {
  try {
    const {
      keyword = '',
      category,
      species,
      locationId,
      byDate = 'true',
      byPrice,
      byPopularity,
      page = 1,
      limit = 6,
      sex
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    let filter = {};

    // Keyword search (title or name)
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
        { comment: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Species filter
    if (species) {
      filter.species = species;
    }

    // Location filter
    if (locationId) {
      filter.location = locationId;
    }

    // Sex filter
    if (sex) {
      filter.sex = sex;
    }

    // Build sort object
    let sort = {};
    
    if (byDate === 'true') {
      sort.createdAt = -1; // Sort by date descending (newest first)
    }
    
    if (byPrice === 'true') {
      sort.price = -1; // Sort by price descending
    } else if (byPrice === 'false') {
      sort.price = 1; // Sort by price ascending
    }
    
    if (byPopularity === 'true') {
      sort.popularity = -1; // Sort by popularity descending
    }

    // Get notices with filters and pagination
    const notices = await Notice.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('location', '_id stateEn cityEn')
      .select('-__v');

    // Get total count
    const total = await Notice.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      page: pageNum,
      perPage: limitNum,
      totalPages: totalPages,
      results: notices
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = ['found', 'free', 'lost', 'sell'];
    res.status(200).json(categories);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getSex = async (req, res) => {
  try {
    const sexOptions = ['female', 'male', 'multiple', 'unknown'];
    res.status(200).json(sexOptions);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getSpecies = async (req, res) => {
  try {
    const species = [
      'dog', 'cat', 'monkey', 'bird', 'snake', 'turtle',
      'lizard', 'frog', 'fish', 'ants', 'bees', 'butterfly',
      'spider', 'scorpion'
    ];
    res.status(200).json(species);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const userId = req.user._id;

    if (!noticeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'This id is not valid'
      });
    }

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    const user = await User.findById(userId);
    if (user.noticesFavorites.includes(noticeId)) {
      return res.status(409).json({
        success: false,
        message: "This notice has already added to user's favorite notices"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { noticesFavorites: noticeId } },
      { new: true }
    );

    await Notice.findByIdAndUpdate(
      noticeId,
      { $inc: { popularity: 1 } }
    );

    res.status(200).json(updatedUser.noticesFavorites);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const userId = req.user._id;

    if (!noticeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'This id is not valid'
      });
    }

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    const user = await User.findById(userId);
    if (!user.noticesFavorites.includes(noticeId)) {
      return res.status(409).json({
        success: false,
        message: "This notice is not found in user's favorite notices"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { noticesFavorites: noticeId } },
      { new: true }
    );

    await Notice.findByIdAndUpdate(
      noticeId,
      { $inc: { popularity: -1 } }
    );

    res.status(200).json(updatedUser.noticesFavorites);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;

    if (!noticeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Bad request (invalid request body)'
      });
    }

    const notice = await Notice.findById(noticeId)
      .populate('user', '_id email phone')
      .populate('location', '_id stateEn cityEn')
      .select('-__v');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    res.status(200).json(notice);

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

