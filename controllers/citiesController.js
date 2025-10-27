const Location = require('../models/Location');
const Notice = require('../models/Notice');

exports.getCities = async (req, res) => {
  try {
    const { keyword } = req.query;

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

    const cities = await Location.find({
      $or: [
        { cityEn: { $regex: keyword, $options: 'i' } },
        { cityUa: { $regex: keyword, $options: 'i' } }
      ]
    })
      .select('_id useCounty stateEn cityEn countyEn')
      .limit(50)
      .lean();

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json(cities);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const noticeLocations = await Notice.distinct('location');

    if (!noticeLocations || noticeLocations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

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
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

