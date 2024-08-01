const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "../", "../", ".env"),
});

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_ID: process.env.EMAIL_ID,
  JWT_KEY: process.env.JWT_KEY,
  APP_API: process.env.APP_API
};
