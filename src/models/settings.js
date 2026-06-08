const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    modificationDeadline: { type: Date, required: true }
});

module.exports = mongoose.model('Settings', settingsSchema);