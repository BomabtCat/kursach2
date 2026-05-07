const mongoose = require("mongoose");
const config = require("./env");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB подключена");
  } catch (err) {
    logger.error(`Ошибка подключения к MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
