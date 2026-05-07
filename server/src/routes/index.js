const express = require("express");
const authRoutes = require("./authRoutes");
const createCrudRouter = require("./crudRoutes");
const dashboardController = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const validators = require("../validators/resourceValidators");
const Asset = require("../models/Asset");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Incident = require("../models/Incident");
const MaintenanceLog = require("../models/MaintenanceLog");
const Vendor = require("../models/Vendor");

const router = express.Router();

router.use("/auth", authRoutes);
router.get("/dashboard", protect, dashboardController.summary);
router.use("/assets", createCrudRouter({ model: Asset, populate: ["assignedTo", "department", "vendor"], validator: validators.asset }));
router.use("/employees", createCrudRouter({ model: Employee, populate: ["department"], validator: validators.employee }));
router.use("/departments", createCrudRouter({ model: Department, validator: validators.department }));
router.use("/incidents", createCrudRouter({ model: Incident, populate: ["asset", "assignedTo"], validator: validators.incident }));
router.use("/maintenance", createCrudRouter({ model: MaintenanceLog, populate: ["asset"], validator: validators.maintenance }));
router.use("/vendors", createCrudRouter({ model: Vendor, validator: validators.vendor }));

module.exports = router;
