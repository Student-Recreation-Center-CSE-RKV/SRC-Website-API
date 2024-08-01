const mongoose = require("mongoose");

const {MONGODB_URI} =require('./serverConfig');

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = { connect };
