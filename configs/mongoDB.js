const mongoose = require("mongoose");

// const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@habit-tracker.sulnj.mongodb.net/?retryWrites=true&w=majority&appName=habit-tracker`;
const MONGODB_URI = `mongodb://localhost:27017/habit-tracker`;

const mongoDBConnection = mongoose
  .connect(MONGODB_URI)
  .then((connection) => connection);

module.exports = {
  MONGODB_URI,
  mongoDBConnection,
};
