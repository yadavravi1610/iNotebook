const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');

const dbToConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "iNotebook",
    });
    console.log(`Database connected successfully → ${mongoose.connection.name}`);
  } catch (error) {
    console.log("Database not connected", error);
  }
};



module.exports = dbToConnect;

const client = new MongoClient(process.env.MONGODB_URI);

// Test the connection
client.connect()
  .then(() => console.log("Connected:", client.db().databaseName))
  .catch(err => console.error("Connection error:", err));

module.exports = client;
