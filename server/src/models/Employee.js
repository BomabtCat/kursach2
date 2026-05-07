const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    position: { type: String, default: "" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
