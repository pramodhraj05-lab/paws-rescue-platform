process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_for_jest_only";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

async function setupTestDB() {
  if (process.env.MONGO_TEST_URI) {
    // CI mode: use real MongoDB service
    await mongoose.connect(process.env.MONGO_TEST_URI);
  } else {
    // Local mode: in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }
}

async function teardownTestDB() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = { setupTestDB, teardownTestDB, clearTestDB };