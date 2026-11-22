const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[Database] Connected to MongoDB at: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Failed to connect to configured MONGODB_URI: ${err.message}`);
      console.log('[Database] Initializing fallback in-memory MongoDB server for seamless local development...');
    }
  }

  // Fallback to in-memory MongoDB server so platform runs out-of-the-box
  try {
    const fs = require('fs');
    const localMongod = 'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe';
    if (fs.existsSync(localMongod)) {
      process.env.MONGOMS_SYSTEM_BINARY = localMongod;
    }

    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[Database] In-memory MongoDB running successfully at ${memUri}`);
    return conn;
  } catch (err) {
    console.error(`[Database Error] Failed to initialize fallback database: ${err.message}`);
    throw err;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
