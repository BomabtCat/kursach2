const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", VendorSchema);
