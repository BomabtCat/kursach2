const { body, param } = require("express-validator");

const id = [param("id").isMongoId().withMessage("Некорректный id")];

const asset = [
  body("inventoryNumber").trim().notEmpty(),
  body("name").trim().notEmpty(),
  body("type").isIn(["server", "laptop", "router", "printer", "other"]),
  body("status").optional().isIn(["active", "inactive", "repair", "retired"])
];

const employee = [
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("email").isEmail().normalizeEmail()
];

const department = [body("name").trim().notEmpty(), body("code").trim().notEmpty()];
const vendor = [body("name").trim().notEmpty()];

const incident = [
  body("title").trim().notEmpty(),
  body("asset").isMongoId(),
  body("priority").optional().isIn(["low", "medium", "high", "critical"]),
  body("status").optional().isIn(["open", "in_progress", "resolved", "closed"])
];

const maintenance = [
  body("asset").isMongoId(),
  body("type").trim().notEmpty(),
  body("performedBy").trim().notEmpty(),
  body("cost").optional().isNumeric()
];

module.exports = { id, asset, employee, department, vendor, incident, maintenance };
