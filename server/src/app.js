const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/env");
const routes = require("./routes");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(rateLimit({ windowMs: config.rateLimitWindowMs, max: config.rateLimitMax }));
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.json({ success: true, message: "IT Infrastructure System API" }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
