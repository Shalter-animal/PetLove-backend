const express = require('express');
const router = express.Router();

const { register, login, getMe, getMeFull, logout, editUser, addPet, removePet } = require('../controllers/authController');

const { registerValidation, loginValidation, validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User sign up
 *     tags: [Users]
 *     description: Create a new user account with name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John Doe
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: password123
 *                 description: User's password (must contain at least one number)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: Password confirmation (must match password)
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT authentication token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00.000Z
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post('/signup', registerValidation, validate, register);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: User sign in
 *     tags: [Users]
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT authentication token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/signin', loginValidation, validate, login);

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     description: Get the profile information of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 658e94c4ef5b4b3b6f1cdc94
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 noticesFavorites:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/current', protect, getMe);

/**
 * @swagger
 * /users/current/full:
 *   get:
 *     summary: Get current user full info
 *     tags: [Users]
 *     description: Get the full profile information including pets, favorites, and viewed notices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full user profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65d47cee94ee27539ccf3e28
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 avatar:
 *                   type: string
 *                   example: https://example.com/avatar.png
 *                 phone:
 *                   type: string
 *                   example: +381111111111
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 noticesViewed:
 *                   type: array
 *                   items:
 *                     type: object
 *                 noticesFavorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/current/full', protect, getMeFull);

/**
 * @swagger
 * /users/signout:
 *   post:
 *     summary: User sign out
 *     tags: [Users]
 *     description: Logout the current user (client should remove token from storage)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post('/signout', protect, logout);

/**
 * @swagger
 * /users/current/edit:
 *   patch:
 *     summary: User edit
 *     tags: [Users]
 *     description: Edit current user profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: TestName
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@gmail.com
 *               phone:
 *                 type: string
 *                 example: +381111111111
 *               avatar:
 *                 type: string
 *                 example: https://test.png
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
 *                   example: 65d47cee94ee27539ccf3e28
 *                 name:
 *                   type: string
 *                   example: TestName
 *                 email:
 *                   type: string
 *                   example: tesewewewewewewet@gmail.com
 *                 avatar:
 *                   type: string
 *                   example: https://test.png
 *                 phone:
 *                   type: string
 *                   example: +381111111111
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 noticesViewed:
 *                   type: array
 *                   items:
 *                     type: object
 *                 noticesFavorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request (invalid request body)
 *       404:
 *         description: Service not found
 *       409:
 *         description: User with such an email is already exist
 *       500:
 *         description: Server error
 */
router.patch('/current/edit', protect, editUser);

/**
 * @swagger
 * /users/current/pets/add:
 *   post:
 *     summary: User adds pet
 *     tags: [Users]
 *     description: Add a new pet to user's pets collection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - title
 *               - imgURL
 *               - species
 *               - birthday
 *               - sex
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rex
 *               title:
 *                 type: string
 *                 example: Playful family member
 *               imgURL:
 *                 type: string
 *                 example: https://test.webp
 *               species:
 *                 type: string
 *                 enum: [dog, cat, fish, bird, other]
 *                 example: dog
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 2020-01-01
 *               sex:
 *                 type: string
 *                 enum: [male, female, unknown]
 *                 example: male
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
 *                   example: 65d47cee94ee27539ccf3e28
 *                 name:
 *                   type: string
 *                   example: TestName
 *                 email:
 *                   type: string
 *                   example: tesewewewewewewet@gmail.com
 *                 avatar:
 *                   type: string
 *                   example: https://test.png
 *                 phone:
 *                   type: string
 *                   example: +381111111111
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 noticesViewed:
 *                   type: array
 *                   items:
 *                     type: object
 *                 noticesFavorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request (invalid request body)
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.post('/current/pets/add', protect, addPet);

/**
 * @swagger
 * /users/current/pets/remove/{id}:
 *   delete:
 *     summary: Remove a pet from user pets
 *     tags: [Users]
 *     description: Delete a pet from user's pets collection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet id
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
 *                   example: 65d47cee94ee27539ccf3e28
 *                 name:
 *                   type: string
 *                   example: TestName
 *                 email:
 *                   type: string
 *                   example: tesewewewewewewet@gmail.com
 *                 avatar:
 *                   type: string
 *                   example: https://test.png
 *                 phone:
 *                   type: string
 *                   example: +381111111111
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDQ3Y2VlOTRlZTI3NTM5Y2NmM2UyOCIsImlhdCI6MTcwODQyNTk4MiwiZXhwIjoxNzk0ODI1OTgyfQ.bqrgsPxMhe7ZfrYQWskIZzX7SfwxKprkP9wV8zRYcLs
 *                 noticesViewed:
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
 *                         example: 2023-12-11T10:43:28.477Z
 *                       user:
 *                         type: string
 *                         example: 6576e7d0c4cc99fc5ef94221
 *                       popularity:
 *                         type: number
 *                         example: 3
 *                       updatedAt:
 *                         type: string
 *                         example: 2024-02-20T10:47:23.359Z
 *                 noticesFavorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6589436d05a6bcd9b9379421
 *                       species:
 *                         type: string
 *                         example: fish
 *                       category:
 *                         type: string
 *                         example: free
 *                       title:
 *                         type: string
 *                         example: Colorful Betta Fish
 *                       name:
 *                         type: string
 *                         example: Splash
 *                       birthday:
 *                         type: string
 *                         example: 2021-04-05
 *                       comment:
 *                         type: string
 *                         example: Free to a good home. Beautiful betta fish.
 *                       sex:
 *                         type: string
 *                         example: unknown
 *                       location:
 *                         type: string
 *                         example: 641ffcd2ae4e889a02d28d11
 *                       imgURL:
 *                         type: string
 *                         example: https://ftp.goit.study/img/pets/3.webp
 *                       createdAt:
 *                         type: string
 *                         example: 2023-12-11T10:43:28.477Z
 *                       user:
 *                         type: string
 *                         example: 6576e7d0c4cc99fc5ef94221
 *                       popularity:
 *                         type: number
 *                         example: 3
 *                       updatedAt:
 *                         type: string
 *                         example: 2024-02-20T10:17:49.528Z
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65d48367b3c1132894a596a3
 *                       name:
 *                         type: string
 *                         example: Lucie
 *                       title:
 *                         type: string
 *                         example: Playful family member
 *                       imgURL:
 *                         type: string
 *                         example: https://test2.webp
 *                       species:
 *                         type: string
 *                         example: cat
 *                       birthday:
 *                         type: string
 *                         example: 2020-08-09
 *                       sex:
 *                         type: string
 *                         example: female
 *                       createdAt:
 *                         type: string
 *                         example: 2024-02-20T10:48:07.780Z
 *                       updatedAt:
 *                         type: string
 *                         example: 2024-02-20T10:48:07.780Z
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-02-20T10:20:30.887Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-02-20T10:48:07.834Z
 *       400:
 *         description: This id is not valid
 *       404:
 *         description: This pet is not found
 *       409:
 *         description: You aren't owner of this pet
 *       500:
 *         description: Server error
 */
router.delete('/current/pets/remove/:id', protect, removePet);

module.exports = router;

