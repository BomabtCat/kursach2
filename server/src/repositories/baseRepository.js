class BaseRepository {
  constructor(model, populate = []) {
    this.model = model;
    this.populate = populate;
    this.sortFields = [
      "createdAt",
      "updatedAt",
      "name",
      "title",
      "inventoryNumber",
      "email",
      "code",
      "lastName",
      "status",
      "priority",
      "type",
      "date"
    ];
  }

  buildFilter(query = {}) {
    const filter = { deletedAt: null };
    if (query.status) filter.status = query.status;
    if (query.search) {
      const regex = new RegExp(String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = ["name", "title", "inventoryNumber", "email", "code", "lastName"].map((field) => ({
        [field]: regex
      }));
    }
    return filter;
  }

  async findAll(query = {}) {
    const pageNumber = Number(query.page);
    const limitNumber = Number(query.limit);
    const page = Number.isFinite(pageNumber) && pageNumber > 0 ? Math.floor(pageNumber) : 1;
    const limit = Number.isFinite(limitNumber) && limitNumber > 0 ? Math.min(Math.floor(limitNumber), 100) : 10;
    const sortBy = this.sortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const filter = this.buildFilter(query);

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .populate(this.populate)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit),
      this.model.countDocuments(filter)
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) || 1 };
  }

  findById(id) {
    return this.model.findOne({ _id: id, deletedAt: null }).populate(this.populate);
  }

  create(data) {
    return this.model.create(data);
  }

  update(id, data) {
    return this.model.findOneAndUpdate({ _id: id, deletedAt: null }, data, {
      new: true,
      runValidators: true
    });
  }

  softDelete(id, userId) {
    return this.update(id, { deletedAt: new Date(), updatedBy: userId });
  }
}

module.exports = BaseRepository;
