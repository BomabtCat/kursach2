const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    refreshTokenHash: { type: String, default: null },
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
