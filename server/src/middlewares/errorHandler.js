const logger = require("../utils/logger");

const fieldLabels = {
  username: "Логин",
  inventoryNumber: "Инвентарный номер",
  email: "Email",
  code: "Код"
};

const normalizeError = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || err.keyPattern || {})[0];
    const label = fieldLabels[field] || field || "Значение";
    return {
      statusCode: 409,
      message: `${label} уже используется`,
      details: err.keyValue || null
    };
  }

  if (err.name === "ValidationError") {
    return {
      statusCode: 422,
      message: "Ошибка валидации",
      details: Object.values(err.errors).map((item) => ({
        field: item.path,
        message: item.message
      }))
    };
  }

  if (err.name === "CastError") {
    return {
      statusCode: 400,
      message: "Некорректный формат данных",
      details: { field: err.path, value: err.value }
    };
  }

  return {
    statusCode: err.statusCode || 500,
    message: err.message,
    details: err.details || null
  };
};

module.exports = (err, req, res, _next) => {
  const normalized = normalizeError(err);
  const statusCode = normalized.statusCode;
  const payload = {
    success: false,
    error: {
      message: statusCode === 500 ? "Внутренняя ошибка сервера" : normalized.message,
      details: normalized.details
    }
  };

  if (statusCode === 500) logger.error(err.stack || err.message);
  res.status(statusCode).json(payload);
};
