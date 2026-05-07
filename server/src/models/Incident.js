const mongoose = require("mongoose");
const { auditFields } = require("./baseFields");

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    closedAt: { type: Date, default: null },
    comments: [CommentSchema],
    ...auditFields
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", IncidentSchema);
