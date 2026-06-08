const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MONGODB_URI is not set. Please configure it in environment variables.');
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.on('error', (err) => {
    console.error('MongoDB client emitted error:', err);
});


let cachedDb = null;
async function getDB() {
    try {
        if (!cachedDb) {
            await client.connect();
            cachedDb = client.db('wedding');
        }
        return cachedDb;
    } catch (err) {
        console.error("MongoDB connection error in getDB:", err);
        throw err;
    }
}

module.exports = getDB;