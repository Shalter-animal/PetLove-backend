const Location = require('../models/Location');
const Notice = require('../models/Notice');

// GET /cities/ - Get Ukrainian cities by keyword
exports.getCities = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Validate keyword
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Bad request (invalid request query)'
      });
    }

    if (keyword.length < 3 || keyword.length > 48) {
      return res.status(400).json({
        success: false,
        message: 'Bad request (invalid request query)'
      });
    }

    // Search cities by keyword (case-insensitive)
    const cities = await Location.find({
      $or: [
        { cityEn: { $regex: keyword, $options: 'i' } },
        { cityUa: { $regex: keyword, $options: 'i' } }
      ]
    })
      .select('_id useCounty stateEn cityEn countyEn')
      .limit(50) // Limit results to prevent overload
      .lean();

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json(cities);

  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /cities/locations - Get all cities where pets are described in notices
exports.getLocations = async (req, res) => {
  try {
    // Get all unique location IDs from notices
    const noticeLocations = await Notice.distinct('location');

    if (!noticeLocations || noticeLocations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get location details for these IDs
    const locations = await Location.find({
      _id: { $in: noticeLocations }
    })
      .select('_id useCounty stateEn cityEn countyEn')
      .lean();

    if (!locations || locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json(locations);

  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

