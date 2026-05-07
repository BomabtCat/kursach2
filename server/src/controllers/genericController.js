const asyncHandler = require("../utils/asyncHandler");

const createGenericController = (service) => ({
  list: asyncHandler(async (req, res) => {
    const data = await service.list(req.query);
    res.json({ success: true, data });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await service.get(req.params.id);
    res.json({ success: true, data });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data });
  }),
  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.user.id);
    res.json({ success: true, data: null });
  })
});

module.exports = createGenericController;
