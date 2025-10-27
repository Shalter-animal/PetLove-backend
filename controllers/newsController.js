const News = require('../models/News');

// GET /news - Получить все новости с пагинацией и поиском
exports.getNews = async (req, res) => {
  try {
    const { keyword = '', page = 1, limit = 6 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Создаем фильтр для поиска
    let filter = {};
    if (keyword) {
      filter = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { text: { $regex: keyword, $options: 'i' } }
        ]
      };
    }

    // Получаем новости с пагинацией
    const news = await News.find(filter)
      .sort({ date: -1 }) // Сортировка по дате (новые первыми)
      .skip(skip)
      .limit(limitNum)
      .select('-createdAt -updatedAt -__v'); // Исключаем служебные поля

    // Подсчитываем общее количество
    const total = await News.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      page: pageNum,
      perPage: limitNum,
      totalPages: totalPages,
      results: news
    });

  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

