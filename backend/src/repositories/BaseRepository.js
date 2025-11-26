/**
 * Base Repository Class
 * 
 * Provides common data access patterns for all repositories.
 * Separates data access logic from business logic.
 * 
 * @version 1.0
 */

const { Op } = require('sequelize');

class BaseRepository {
  /**
   * @param {Object} model - Sequelize model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Find record by primary key
   */
  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  /**
   * Find one record by criteria
   */
  async findOne(where, options = {}) {
    return await this.model.findOne({ where, ...options });
  }

  /**
   * Find all records by criteria
   */
  async findAll(where = {}, options = {}) {
    return await this.model.findAll({ where, ...options });
  }

  /**
   * Find with pagination
   */
  async findPaginated(where = {}, { page = 1, limit = 10, ...options } = {}) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      ...options
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Create new record
   */
  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  /**
   * Create multiple records
   */
  async bulkCreate(data, options = {}) {
    return await this.model.bulkCreate(data, options);
  }

  /**
   * Update record
   */
  async update(id, data, options = {}) {
    const record = await this.findById(id);
    if (!record) return null;
    return await record.update(data, options);
  }

  /**
   * Update records by criteria
   */
  async updateWhere(where, data, options = {}) {
    return await this.model.update(data, { where, ...options });
  }

  /**
   * Delete record
   */
  async delete(id, options = {}) {
    const record = await this.findById(id);
    if (!record) return false;
    await record.destroy(options);
    return true;
  }

  /**
   * Delete records by criteria
   */
  async deleteWhere(where, options = {}) {
    return await this.model.destroy({ where, ...options });
  }

  /**
   * Count records
   */
  async count(where = {}, options = {}) {
    return await this.model.count({ where, ...options });
  }

  /**
   * Check if record exists
   */
  async exists(where) {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Find or create record
   */
  async findOrCreate(where, defaults = {}, options = {}) {
    return await this.model.findOrCreate({ where, defaults, ...options });
  }

  /**
   * Increment field value
   */
  async increment(id, field, value = 1) {
    const record = await this.findById(id);
    if (!record) return null;
    return await record.increment(field, { by: value });
  }

  /**
   * Decrement field value
   */
  async decrement(id, field, value = 1) {
    const record = await this.findById(id);
    if (!record) return null;
    return await record.decrement(field, { by: value });
  }

  /**
   * Execute raw query
   */
  async raw(query, options = {}) {
    return await this.model.sequelize.query(query, options);
  }

  /**
   * Begin transaction
   */
  async transaction(callback) {
    return await this.model.sequelize.transaction(callback);
  }

  /**
   * Get today's records (date column must be 'created_at' or specified)
   */
  async getTodayRecords(where = {}, dateColumn = 'created_at') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await this.findAll({
      ...where,
      [dateColumn]: {
        [Op.gte]: today
      }
    });
  }

  /**
   * Get records within date range
   */
  async getRecordsBetween(startDate, endDate, where = {}, dateColumn = 'created_at') {
    return await this.findAll({
      ...where,
      [dateColumn]: {
        [Op.between]: [startDate, endDate]
      }
    });
  }

  /**
   * Get recent records (last N records)
   */
  async getRecent(limit = 10, where = {}, orderBy = 'created_at', order = 'DESC') {
    return await this.findAll(where, {
      limit,
      order: [[orderBy, order]]
    });
  }
}

module.exports = BaseRepository;

