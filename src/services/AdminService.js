const ExcelJS = require('exceljs');

const getDB = require('../db');

// RSVP deadline (customize as needed)
const RSVP_DEADLINE = new Date(process.env.RSVP_DEADLINE || '2025-10-01T23:59:59Z');



async function parseExcelAndLoadData(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.worksheets[0];

    const invitations = [];

    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header
           invitations.push({
            name: row.getCell(1).value,  // Will be split for guest splitting
            numberOfGuests: row.getCell(2).value,
            phoneNumber: row.getCell(3).value,
            message: row.getCell(4).value,
            guests: [
               {name: row.getCell(1).value}, // Always add as first guest
               {name: row.getCell(5).value},
               {name: row.getCell(6).value},
               {name: row.getCell(7).value},
               {name: row.getCell(8).value},
               {name: row.getCell(9).value}
            ].filter(Boolean) // Filter empty cells
        });
    });

    return await addOrUpdateInvitationsBatch(invitations);
}

async function addOrUpdateInvitationsBatch (invitations)  {
    const results = [];

    for (const invitation of invitations) {
        const saved = await addOrUpdateInvitation(invitation.id, invitation.name, invitation.numberOfGuests, invitation.phoneNumber, invitation.message, invitation.guests);
        results.push(saved);
    }

    return results;
};

async function addOrUpdateInvitation(id, name, numberOfGuests, phoneNumber, message, guests) {
    const db = await getDB();
    const invitationColl = db.collection('invitation');
    const guestColl = db.collection('guest');
    const now = new Date();


    // 1. Insert/update invitation
    const filter = id
        ? { _id: new mongoose.Types.ObjectId(id) }
        : { name };

    let result = await invitationColl.findOneAndUpdate(
        filter,
        {
            $set: {
                name,
                numberOfGuests,
                phoneNumber,
                message,
                status: "pending",
            }
        },
        { upsert: true, returnDocument: 'after' }
    );

    // If result.value is null (happens for upsert sometimes), fetch invitation manually
    let invitation = result.value;
    if (!invitation) {
        invitation = await invitationColl.findOne(filter);
        if (!invitation) throw new Error('Invitation not found or created');
    }

    for (const guest of guests) {
        if(guest.name != null) {
            await guestColl.insertOne({
                invitationId: invitation._id,
                name: guest.name,
                attending: "pending"
            });
        }
    }

    return invitation;
}

async function getAllInvitations() {
    const db = await getDB();
    return db.collection('invitation').aggregate([
        {
            $lookup: {
                from: 'guest',          // The guests collection
                localField: '_id',      // invitation._id
                foreignField: 'invitationId', // guest.invitationId
                as: 'guests'            // Add guests as an array field
            }
        }
    ]).toArray();
}

async function getUser(username, password){
    const db = await getDB();
    return db.collection('admin').findOne({ username, password });
}

module.exports = {
    addOrUpdateInvitation,
    getAllInvitations,
    getUser,
    addOrUpdateInvitationsBatch,
    parseExcelAndLoadData,
    RSVP_DEADLINE
};