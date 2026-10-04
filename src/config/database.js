const mongoose = require("mongoose");

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }
  await connectionPromise;
}

module.exports = connectDatabase;
