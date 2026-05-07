const app = require("./src/app");
const connectDB = require("./src/config/db");
const config = require("./src/config/env");
const logger = require("./src/utils/logger");

connectDB().then(() => {
  app.listen(config.port, () => logger.info(`Server запущен на ${config.port}`));
});
