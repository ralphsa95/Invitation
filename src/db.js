const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient("mongodb+srv://rsaade:mongo123!!@firstcluster.cy08auw.mongodb.net/?retryWrites=true&w=majority&appName=firstCluster", {
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