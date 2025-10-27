const Notice = require('../models/Notice');
const User = require('../models/User');

// GET /notices - Get all notices with filters and pagination
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
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /notices/categories - Get all available categories
exports.getCategories = async (req, res) => {
  try {
    // Return categories from Notice model enum
    const categories = ['found', 'free', 'lost', 'sell'];
    
    res.status(200).json(categories);

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /notices/sex - Get all available sex options
exports.getSex = async (req, res) => {
  try {
    // Return sex options from Notice model enum
    const sexOptions = ['female', 'male', 'multiple', 'unknown'];
    
    res.status(200).json(sexOptions);

  } catch (error) {
    console.error('Get sex options error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sex options',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /notices/species - Get all available species
exports.getSpecies = async (req, res) => {
  try {
    // Return species from Notice model enum
    const species = [
      'dog', 'cat', 'monkey', 'bird', 'snake', 'turtle', 
      'lizard', 'frog', 'fish', 'ants', 'bees', 'butterfly', 
      'spider', 'scorpion'
    ];
    
    res.status(200).json(species);

  } catch (error) {
    console.error('Get species error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching species',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /notices/favorites/add/:id - Add notice to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const userId = req.user._id;

    // Validate ObjectId
    if (!noticeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'This id is not valid'
      });
    }

    // Check if notice exists
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    // Check if already in favorites
    const user = await User.findById(userId);
    if (user.noticesFavorites.includes(noticeId)) {
      return res.status(409).json({
        success: false,
        message: "This notice has already added to user's favorite notices"
      });
    }

    // Add to favorites and increment popularity
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { noticesFavorites: noticeId } },
      { new: true }
    );

    await Notice.findByIdAndUpdate(
      noticeId,
      { $inc: { popularity: 1 } }
    );

    // Return array of favorite notice IDs
    res.status(200).json(updatedUser.noticesFavorites);

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE /notices/favorites/remove/:id - Remove notice from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const userId = req.user._id;

    // Validate ObjectId
    if (!noticeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'This id is not valid'
      });
    }

    // Check if notice exists
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    // Check if in favorites
    const user = await User.findById(userId);
    if (!user.noticesFavorites.includes(noticeId)) {
      return res.status(409).json({
        success: false,
        message: "This notice is not found in user's favorite notices"
      });
    }

    // Remove from favorites and decrement popularity
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { noticesFavorites: noticeId } },
      { new: true }
    );

    await Notice.findByIdAndUpdate(
      noticeId,
      { $inc: { popularity: -1 } }
    );

    // Return array of favorite notice IDs
    res.status(200).json(updatedUser.noticesFavorites);

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /notices/:id - Get notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;

    // Validate ObjectId
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
    console.error('Get notice by ID error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'This notice is not found in notices'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching notice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

