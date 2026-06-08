const express = require('express');
const router = express.Router();
const guestController = require('../controllers/GuestController');

/**
 * @swagger
 * /invitation/{invId}:
 *   get:
 *     summary: Get invitation details by invitation ID
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: invId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invitation
 *     responses:
 *       200:
 *         description: Invitation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 */
router.get('/:invId', guestController.getInvitation);

/**
 * @swagger
 * /invitation/{invId}/reply:
 *   post:
 *     summary: Submit a guest's reply (RSVP)
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: invId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invitation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attending:
 *                 type: boolean
 *                 example: true
 *               message:
 *                 type: string
 *                 example: "Looking forward to it!"
 *     responses:
 *       200:
 *         description: RSVP submitted successfully
 */
router.post('/:invId/reply', guestController.replyInvitation);

module.exports = router;