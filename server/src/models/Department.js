const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    managerName: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
