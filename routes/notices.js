const express = require('express');
const router = express.Router();

const {
  getNotices,
  getCategories,
  getSex,
  getSpecies,
  addToFavorites,
  removeFromFavorites,
  getNoticeById
} = require('../controllers/noticesController');

const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /notices:
 *   get:
 *     summary: Get notices
 *     tags: [Notices]
 *     description: Get all notices with filtering, sorting, and pagination
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: The keyword for searching
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [sell, free, lost, found]
 *         description: The category for searching
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           enum: [dog, cat, monkey, bird, snake, turtle, lizard, frog, fish, ants, bees, butterfly, spider, scorpion]
 *         description: The species for searching
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *         description: The location id for searching
 *       - in: query
 *         name: byDate
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Sort notices by date
 *       - in: query
 *         name: byPrice
 *         schema:
 *           type: boolean
 *         description: Sort notices by price
 *       - in: query
 *         name: byPopularity
 *         schema:
 *           type: boolean
 *         description: Sort notices by popularity
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: The number page of the notices
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 6
 *         description: The limit for the notices
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [unknown, female, male, multiple]
 *         description: Sort notices by sex
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
 *                   example: 2
 *                 totalPages:
 *                   type: number
 *                   example: 26
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6589436d05a6bcd9b9379420
 *                       species:
 *                         type: string
 *                         example: dog
 *                       category:
 *                         type: string
 *                         example: sell
 *                       price:
 *                         type: number
 *                         example: 150
 *                       title:
 *                         type: string
 *                         example: Golden Retriever Puppies
 *                       name:
 *                         type: string
 *                         example: Max
 *                       birthday:
 *                         type: string
 *                         example: 2022-01-10
 *                       comment:
 *                         type: string
 *                         example: Adorable puppy looking for a loving home.
 *                       sex:
 *                         type: string
 *                         example: male
 *                       location:
 *                         type: string
 *                         example: 641ffcc1ae4e889a02d25ca5
 *                       imgURL:
 *                         type: string
 *                         example: https://ftp.goit.study/img/pets/1.webp
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-12-11T10:43:28.477Z
 *                       user:
 *                         type: string
 *                         example: 6576e7d0c4cc99fc5ef94221
 *                       popularity:
 *                         type: number
 *                         example: 2
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-12-25T11:41:12.493Z
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/', getNotices);

/**
 * @swagger
 * /notices/categories:
 *   get:
 *     summary: Get notice categories
 *     tags: [Notices]
 *     description: Get all available notice categories
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["found", "free", "lost", "sell"]
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /notices/sex:
 *   get:
 *     summary: Get notice sex
 *     tags: [Notices]
 *     description: Get all available sex options for notices
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["female", "male", "multiple", "unknown"]
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/sex', getSex);

/**
 * @swagger
 * /notices/species:
 *   get:
 *     summary: Get notice species
 *     tags: [Notices]
 *     description: Get all available species for notices
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["dog", "cat", "monkey", "bird", "snake", "turtle", "lizard", "frog", "fish", "ants", "bees", "butterfly", "spider", "scorpion"]
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/species', getSpecies);

/**
 * @swagger
 * /notices/favorites/add/{id}:
 *   post:
 *     summary: Add a notice to user favorites
 *     tags: [Notices]
 *     description: Add a notice to the authenticated user's favorites list
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notice id
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["6589436d05a6bcd9b9379425", "6589436d05a6bcd9b9379423"]
 *       400:
 *         description: This id is not valid
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: This notice is not found in notices
 *       409:
 *         description: This notice has already added to user's favorite notices
 *       500:
 *         description: Server error
 */
router.post('/favorites/add/:id', protect, addToFavorites);

/**
 * @swagger
 * /notices/favorites/remove/{id}:
 *   delete:
 *     summary: Remove a notice from user favorites
 *     tags: [Notices]
 *     description: Remove a notice from the authenticated user's favorites list
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notice id
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["6589436d05a6bcd9b9379425", "6589436d05a6bcd9b9379423"]
 *       400:
 *         description: This id is not valid
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: This notice is not found in notices
 *       409:
 *         description: This notice is not found in user's favorite notices
 *       500:
 *         description: Server error
 */
router.delete('/favorites/remove/:id', protect, removeFromFavorites);

/**
 * @swagger
 * /notices/{id}:
 *   get:
 *     summary: Get a notice by id
 *     tags: [Notices]
 *     description: Get detailed information about a specific notice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notice id
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6589436d05a6bcd9b9379425
 *                 species:
 *                   type: string
 *                   example: bird
 *                 category:
 *                   type: string
 *                   example: free
 *                 title:
 *                   type: string
 *                   example: Canary Looking for a Home
 *                 name:
 *                   type: string
 *                   example: Sunny
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: 2020-03-12
 *                 comment:
 *                   type: string
 *                   example: Free to a caring owner. Beautiful canary.
 *                 sex:
 *                   type: string
 *                   example: male
 *                 location:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 641ffcc3ae4e889a02d26d45
 *                     stateEn:
 *                       type: string
 *                       example: Dnipropetrovska
 *                     cityEn:
 *                       type: string
 *                       example: Dnipro
 *                 imgURL:
 *                   type: string
 *                   example: https://ftp.goit.study/img/pets/7.webp
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-12-11T10:43:28.477Z
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6576e7d0c4cc99fc5ef94221
 *                     email:
 *                       type: string
 *                       example: test@gmail.com
 *                     phone:
 *                       type: string
 *                       example: +380730000000
 *                 popularity:
 *                   type: number
 *                   example: 2
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-12-29T20:50:09.235Z
 *       400:
 *         description: Bad request (invalid request body)
 *       404:
 *         description: This notice is not found in notices
 *       500:
 *         description: Server error
 */
router.get('/:id', getNoticeById);

module.exports = router;

