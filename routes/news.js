const express = require('express');
const router = express.Router();

const { getNews } = require('../controllers/newsController');

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get news
 *     tags: [News]
 *     description: Get all news with pagination and search functionality
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: The keyword for searching
 *         example: dog
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: The number page of the news
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 6
 *         description: The limit for the news
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: number
 *                   example: 1
 *                 perPage:
 *                   type: number
 *                   example: 6
 *                 totalPages:
 *                   type: number
 *                   example: 576
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 658b694505a6bcd9b9379466
 *                       imgUrl:
 *                         type: string
 *                         example: https://www.nytimes.com/images/2023/04/16/magazine/16mag-LOR/16mag-LOR-blog480.jpg
 *                       title:
 *                         type: string
 *                         example: What I Learned Dogsitting for New York City's Opulent Elite
 *                       text:
 *                         type: string
 *                         example: In a city of yawning class inequality, some side hustles let you glimpse how the other half lives.
 *                       date:
 *                         type: string
 *                         example: 2023-04-11T09:00:18+0000
 *                       url:
 *                         type: string
 *                         example: https://www.nytimes.com/2023/04/11/magazine/dogsitting-rich-new-york.html
 *                       id:
 *                         type: string
 *                         example: nyt://article/8d29f1fc-d146-509d-8ceb-5a5b17d7886b
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/', getNews);

module.exports = router;

