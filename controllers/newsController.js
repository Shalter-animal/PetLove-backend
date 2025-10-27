const News = require('../models/News');

exports.getNews = async (req, res) => {
  try {
    const { keyword = '', page = 1, limit = 6 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};
    if (keyword) {
      filter = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { text: { $regex: keyword, $options: 'i' } }
        ]
      };
    }

    const news = await News.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-createdAt -updatedAt -__v');

    const total = await News.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      page: pageNum,
      perPage: limitNum,
      totalPages: totalPages,
      results: news
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

