const Friend = require('../models/Friend');

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find()
      .select('-createdAt -updatedAt -__v')
      .lean();

    if (!friends || friends.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json(friends);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

