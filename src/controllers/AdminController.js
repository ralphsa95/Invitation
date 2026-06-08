const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const adminService = require('../services/AdminService');


//admin logins
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const admin = await adminService.getUser(username, password);
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username: admin.username }, SECRET, { expiresIn: '1d' });
    res.json({ token });
};



exports.uploadGuestsController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;

        // Parse Excel sheet
        const result =  await adminService.parseExcelAndLoadData(filePath);


        return res.json({
            message: "Guests imported successfully",
            inserted: result
        });

    } catch (error) {
        console.error("Error uploading guests:", error);
        return res.status(500).json({ message: "Failed to import guests" });
    }
}

exports.addUpdateInvitationsBatch = async (req, res) => {
    const invitations = req.body.guests; // expect an array of guest objects

    if (!Array.isArray(invitations) || guests.length === 0) {
        return res.status(400).json({ error: 'Invitations list is required' });
    }

    try {
        // Pass the array to your service
        const results = await adminService.addOrUpdateInvitationsBatch(invitations);
        res.json({ success: true, added: results.length, invitations: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllInvitations = async (req, res) => {
    try {
        const invitations = await adminService.getAllInvitations();
        if (!invitations) return res.status(404).json({ error: 'Invitations not found' });
        res.json(invitations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};