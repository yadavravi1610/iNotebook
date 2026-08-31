const mongoose = require("mongoose");

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
