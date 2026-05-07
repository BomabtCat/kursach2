const { body } = require("express-validator");

const register = [
  body("username").trim().isLength({ min: 3 }).withMessage("Логин минимум 3 символа"),
  body("password").isStrongPassword().withMessage("Пароль должен быть сложным"),
  body("role").optional().isIn(["admin", "manager", "user"])
];

const login = [
  body("username").trim().notEmpty().withMessage("Введите логин"),
  body("password").notEmpty().withMessage("Введите пароль")
];

module.exports = { register, login };
