const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numGuests: { type: Number, required: true },
    replyStatus: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    replyDate: { type: Date },
    lastModified: { type: Date },
    canModifyUntil: { type: Date, required: true },
    email: { type: String },
    notes: { type: String }
});

module.exports = mongoose.model('Guest', guestSchema);