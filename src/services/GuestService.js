const Guest = require('../models/guest');
const Settings = require('../models/settings');
const getDB = require('../db');
const mongoose = require('mongoose');

function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}


async function getInvitation(id) {
    const db = await getDB();
    const results = await db.collection('invitation').aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },   // Match the specific invitation
        {
            $lookup: {
                from: 'guest',
                localField: '_id',
                foreignField: 'invitationId',
                as: 'guests'
            }
        }
    ]).toArray();
    // Aggregate returns an array, but you want a single object (or null if not found)
    return results[0] || null;
}

async function replyInvitation(invitationIdVal, guests, message) {
    if (!mongoose.Types.ObjectId.isValid(invitationIdVal)) {
        throw createHttpError(400, 'Invalid invitation ID');
    }

    const db = await getDB();
    const guestColl = db.collection('guest');
    const invitationColl = db.collection('invitation');

    const invitationIdObj = new mongoose.Types.ObjectId(invitationIdVal);

    // 1. Check invitation exists
    const invitation = await getInvitation(invitationIdVal);
    if (!invitation) {
        throw createHttpError(404, 'Invitation not found');
    }

    // 2. Validate guest array
    if (!Array.isArray(guests) || guests.length === 0) {
        throw createHttpError(400, 'Guests array is required.');
    }

    try {
        const resGuests = [];
        // 3. Update guests' attending status
        for (const guest of guests) {
            if (!guest._id || !mongoose.Types.ObjectId.isValid(guest._id)) {
                continue;
            }

            // Update 'attending' field for the guest (ONLY if guest is part of THIS invitation)
            const resGuest = await guestColl.updateOne(
                { _id: new mongoose.Types.ObjectId(guest._id), invitationId: invitationIdObj },
                { $set: { attending: Boolean(guest.attending) } }
            );
            resGuests.push(resGuest);
        }

        const normalizedMessage = typeof message === 'string' ? message.trim() : '';
        await invitationColl.updateOne(
            { _id: invitationIdObj },
            {
                $set: {
                    message: normalizedMessage,
                    status: 'responded',
                    repliedAt: new Date()
                }
            }
        );

        return {
            guests: resGuests,
            repliedAt: new Date().toISOString()
        };
    } catch (err) {
        throw createHttpError(500, err.message);
    }
}


module.exports = {
    getInvitation,
    replyInvitation
};