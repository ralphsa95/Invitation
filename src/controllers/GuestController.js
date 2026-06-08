
const guestService = require('../services/GuestService');


exports.getInvitation = async (req, res) => {
    try {
        const invitation = await guestService.getInvitation(req.params.invId);
        if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
        res.json(invitation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.replyInvitation = async (req, res) => {
    try {
        const invitationId = req.params.invId;
        const { guests, message } = req.body;

        const results = await guestService.replyInvitation(invitationId, guests, message);
        res.json({ success: true, ...results });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};