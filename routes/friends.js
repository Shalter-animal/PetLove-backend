const express = require('express');
const router = express.Router();

const { getFriends } = require('../controllers/friendsController');

/**
 * @swagger
 * /friends/:
 *   get:
 *     summary: Get Petlove friends
 *     tags: [Friends]
 *     description: Get all Petlove friends with their contact information and working hours
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
 *                     example: 658b664c05a6bcd9b937945c
 *                   title:
 *                     type: string
 *                     example: Sirius
 *                   url:
 *                     type: string
 *                     example: https://dogcat.com.ua
 *                   addressUrl:
 *                     type: string
 *                     example: https://goo.gl/maps/iq8NXEUf31EAQCzc6
 *                   imageUrl:
 *                     type: string
 *                     example: https://ftp.goit.study/img/petsfriends/1.webp
 *                   address:
 *                     type: string
 *                     example: Fedorivka, Kyiv Oblast, Ukraine, 07372
 *                   workDays:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 658f39fccc54e981e2d98778
 *                         isOpen:
 *                           type: boolean
 *                           example: false
 *                         from:
 *                           type: string
 *                           example: "11:00"
 *                         to:
 *                           type: string
 *                           example: "16:00"
 *                   phone:
 *                     type: string
 *                     example: +380931934069
 *                   email:
 *                     type: string
 *                     example: dogcat.sirius@gmail.com
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/', getFriends);

module.exports = router;

