const ApiError = require("../utils/ApiError");

class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  list(query) {
    return this.repository.findAll(query);
  }

  async get(id) {
    const item = await this.repository.findById(id);
    if (!item) throw new ApiError(404, "Запись не найдена");
    return item;
  }

  create(data, userId) {
    return this.repository.create({ ...data, createdBy: userId, updatedBy: userId });
  }

  async update(id, data, userId) {
    const item = await this.repository.update(id, { ...data, updatedBy: userId });
    if (!item) throw new ApiError(404, "Запись не найдена");
    return item;
  }

  async remove(id, userId) {
    const item = await this.repository.softDelete(id, userId);
    if (!item) throw new ApiError(404, "Запись не найдена");
    return item;
  }
}

module.exports = BaseService;
