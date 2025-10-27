const express = require('express');
const router = express.Router();

const {
  getCities,
  getLocations
} = require('../controllers/citiesController');

/**
 * @swagger
 * /cities/:
 *   get:
 *     summary: Get Ukrainian cities
 *     tags: [Cities]
 *     description: Get Ukrainian cities by keyword search
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           maxLength: 48
 *         description: The keyword for city searching (min length 3, max length 48)
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 641ffcd5ae4e889a02d2b2f5
 *                   useCounty:
 *                     type: string
 *                     example: "0"
 *                   stateEn:
 *                     type: string
 *                     example: Lvivska
 *                   cityEn:
 *                     type: string
 *                     example: Reklynets
 *                   countyEn:
 *                     type: string
 *                     example: Sokalskyy
 *       400:
 *         description: Bad request (invalid request query)
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/', getCities);

/**
 * @swagger
 * /cities/locations:
 *   get:
 *     summary: Get all cities where are pets that descripted on notes
 *     tags: [Cities]
 *     description: Get all cities where pets are described in notices
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 641ffcd5ae4e889a02d2b2f5
 *                   useCounty:
 *                     type: string
 *                     example: "0"
 *                   stateEn:
 *                     type: string
 *                     example: Lvivska
 *                   cityEn:
 *                     type: string
 *                     example: Reklynets
 *                   countyEn:
 *                     type: string
 *                     example: Sokalskyy
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/locations', getLocations);

module.exports = router;

