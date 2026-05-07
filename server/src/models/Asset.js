const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const AssetSchema = new mongoose.Schema(
  {
    inventoryNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["server", "laptop", "router", "printer", "other"], required: true },
    model: { type: String, default: "" },
    serialNumber: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive", "repair", "retired"], default: "active" },
    location: { type: String, default: "" },
    purchaseDate: { type: Date, default: null },
    warrantyUntil: { type: Date, default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
    notes: { type: String, default: "" },
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", AssetSchema);
