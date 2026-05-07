const Asset = require("../models/Asset");
const Incident = require("../models/Incident");
const MaintenanceLog = require("../models/MaintenanceLog");
const asyncHandler = require("../utils/asyncHandler");

const summary = asyncHandler(async (req, res) => {
  const [assetTotal, activeIncidents, repairAssets, assetsByDepartment, latestIncidents, latestActions] =
    await Promise.all([
      Asset.countDocuments({ deletedAt: null }),
      Incident.countDocuments({ deletedAt: null, status: { $in: ["open", "in_progress"] } }),
      Asset.countDocuments({ deletedAt: null, status: "repair" }),
      Asset.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "department" } },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$department.name", "Без отдела"] }, count: 1 } }
      ]),
      Incident.find({ deletedAt: null }).populate("asset").sort({ createdAt: -1 }).limit(5),
      MaintenanceLog.find({ deletedAt: null }).populate("asset").sort({ createdAt: -1 }).limit(5)
    ]);

  res.json({
    success: true,
    data: { assetTotal, activeIncidents, repairAssets, assetsByDepartment, latestIncidents, latestActions }
  });
});

module.exports = { summary };
