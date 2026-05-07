const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { protect, allowRoles } = require("../middlewares/authMiddleware");
const validators = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validators.register, validate, authController.register);
router.post("/login", validators.login, validate, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.me);
router.get("/admin-only", protect, allowRoles("admin"), (req, res) =>
  res.json({ success: true, data: "admin" })
);

module.exports = router;
