const express = require("express");
const BaseRepository = require("../repositories/baseRepository");
const BaseService = require("../services/baseService");
const createGenericController = require("../controllers/genericController");
const validate = require("../middlewares/validate");
const { protect, allowRoles } = require("../middlewares/authMiddleware");
const validators = require("../validators/resourceValidators");

const createCrudRouter = ({ model, populate = [], validator = [] }) => {
  const router = express.Router();
  const controller = createGenericController(new BaseService(new BaseRepository(model, populate)));
  const canWrite = allowRoles("admin", "manager");

  router.use(protect);
  router.get("/", controller.list);
  router.get("/:id", validators.id, validate, controller.get);
  router.post("/", canWrite, validator, validate, controller.create);
  router.put("/:id", canWrite, validators.id, validator, validate, controller.update);
  router.delete("/:id", canWrite, validators.id, validate, controller.remove);

  return router;
};

module.exports = createCrudRouter;
