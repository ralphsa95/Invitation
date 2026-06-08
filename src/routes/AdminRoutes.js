const express = require('express');
const multer = require('multer');
const router = express.Router();
const adminController =require('../controllers/AdminController');

const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin123"
 *               password:
 *                 type: string
 *                 example: "myPassword!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', adminController.login);

// Protected routes

/**
 * @swagger
 * /admin/invitations:
 *   get:
 *     summary: Get all invitations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invitations
 */
router.get('/invitations', authenticateToken, adminController.getAllInvitations);

const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /admin/upload-guests:
 *   post:
 *     summary: Upload Excel guest list
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xlsx)
 *     responses:
 *       200:
 *         description: List of invitations
 */
router.post("/upload-guests", upload.single("file"), adminController.uploadGuestsController);


/**
 * @swagger
 * /admin/invitations:
 *   post:
 *     summary: Add or update multiple invitations in batch
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []    # requires JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guests:
 *                 type: array
 *                 description: List of guests to add/update
 *                 items:
 *                   type: object
 *                   required:
 *                     - firstName
 *                     - lastName
 *                     - numberOfGuests,
 *                     - status
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "John"
 *                     numberOfGuests:
 *                       type: integer
 *                       example: 2
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     comment:
 *                       type: string
 *                       example: "VIP guest"
 *     responses:
 *       200:
 *         description: Guests added/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 added:
 *                   type: integer
 *                   example: 2
 *                 guests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       numberOfGuests:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       comment:
 *                         type: string
 *       400:
 *         description: Invalid input / Missing fields
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/invitations', authenticateToken, adminController.addUpdateInvitationsBatch);

module.exports = router;