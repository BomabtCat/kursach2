const jwt = require("jsonwebtoken");
const config = require("../config/env");
const ApiError = require("../utils/ApiError");

const protect = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return next(new ApiError(401, "Требуется авторизация"));

  try {
    req.user = jwt.verify(token, config.jwtAccessSecret);
    next();
  } catch (err) {
    next(new ApiError(401, "Access token недействителен или истек"));
  }
};

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) return next(new ApiError(403, "Недостаточно прав"));
  next();
};

module.exports = { protect, allowRoles };
