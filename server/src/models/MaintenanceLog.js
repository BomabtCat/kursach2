const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const MaintenanceLogSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    type: { type: String, required: true },
    description: { type: String, default: "" },
    performedBy: { type: String, required: true },
    cost: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    nextMaintenanceDate: { type: Date, default: null },
    status: { type: String, enum: ["planned", "completed", "cancelled"], default: "completed" },
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceLog", MaintenanceLogSchema);
