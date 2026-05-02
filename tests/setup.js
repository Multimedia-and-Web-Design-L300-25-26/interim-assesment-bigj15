const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const dotenv = require("dotenv");

// Load test variables
dotenv.config();
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test-secret-key-12345";
}

let mongoServer;

const connect = async () => {
    // Prevent Mongoose from using real DB if already connected
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
};

const closeDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

const clearDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
};

module.exports = { connect, closeDatabase, clearDatabase };
