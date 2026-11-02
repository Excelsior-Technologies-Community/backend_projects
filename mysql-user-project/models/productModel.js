const { query } = require("../config/db");

const ProductModel = {
  /**
   * Create a new product
   */
  async create({
    title,
    description = "",
    price,
    category = "General",
    stock = 0,
    imageUrl,
    imageFilename = null,
    imageSize = 0,
    createdBy
  }) {
    const result = await query(
      `INSERT INTO products (title, description, price, category, stock, image_url, image_filename, image_size, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description ? description.trim() : "",
        Number(price),
        category ? category.trim() : "General",
        Number(stock) || 0,
        imageUrl,
        imageFilename,
        Number(imageSize) || 0,
        createdBy
      ]
    );

    return this.findById(result.insertId);
  },

  /**
   * Find product by ID with creator details
   */
  async findById(id) {
    const rows = await query(
      `SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.stock,
        p.image_url AS imageUrl,
        p.image_filename AS imageFilename,
        p.image_size AS imageSize,
        p.created_by AS createdBy,
        p.created_at AS createdAt,
        p.updated_at AS updatedAt,
        u.name AS creatorName,
        u.email AS creatorEmail
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
      LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      price: parseFloat(row.price),
      category: row.category,
      stock: row.stock,
      imageUrl: row.imageUrl,
      imageFilename: row.imageFilename,
      imageSize: row.imageSize,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: {
        id: row.createdBy,
        name: row.creatorName,
        email: row.creatorEmail
      }
    };
  },

  /**
   * Get all products with search, category filtering, and pagination
   */
  async findAll({ page = 1, limit = 12, search = "", category = "" }) {
    const offset = (page - 1) * limit;
    const whereConditions = [];
    const params = [];

    if (search && search.trim()) {
      whereConditions.push("(p.title LIKE ? OR p.description LIKE ?)");
      const searchWildcard = `%${search.trim()}%`;
      params.push(searchWildcard, searchWildcard);
    }

    if (category && category.trim()) {
      whereConditions.push("p.category = ?");
      params.push(category.trim());
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Count total matching items
    const countSql = `SELECT COUNT(*) AS total FROM products p ${whereClause}`;
    const countRows = await query(countSql, params);
    const total = countRows[0]?.total || 0;

    // Fetch paginated results
    const selectSql = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.stock,
        p.image_url AS imageUrl,
        p.image_filename AS imageFilename,
        p.image_size AS imageSize,
        p.created_by AS createdBy,
        p.created_at AS createdAt,
        p.updated_at AS updatedAt,
        u.name AS creatorName,
        u.email AS creatorEmail
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Append limit and offset to query parameters (as numbers)
    const selectParams = [...params, Number(limit), Number(offset)];
    const rows = await query(selectSql, selectParams);

    const products = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: parseFloat(row.price),
      category: row.category,
      stock: row.stock,
      imageUrl: row.imageUrl,
      imageFilename: row.imageFilename,
      imageSize: row.imageSize,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: {
        id: row.createdBy,
        name: row.creatorName,
        email: row.creatorEmail
      }
    }));

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  /**
   * Update product by ID
   */
  async update(id, updates = {}) {
    const setClauses = [];
    const params = [];

    if (updates.title !== undefined) {
      setClauses.push("title = ?");
      params.push(updates.title.trim());
    }
    if (updates.description !== undefined) {
      setClauses.push("description = ?");
      params.push(updates.description.trim());
    }
    if (updates.price !== undefined) {
      setClauses.push("price = ?");
      params.push(Number(updates.price));
    }
    if (updates.category !== undefined) {
      setClauses.push("category = ?");
      params.push(updates.category.trim());
    }
    if (updates.stock !== undefined) {
      setClauses.push("stock = ?");
      params.push(Number(updates.stock));
    }
    if (updates.imageUrl !== undefined) {
      setClauses.push("image_url = ?");
      params.push(updates.imageUrl);
    }
    if (updates.imageFilename !== undefined) {
      setClauses.push("image_filename = ?");
      params.push(updates.imageFilename);
    }
    if (updates.imageSize !== undefined) {
      setClauses.push("image_size = ?");
      params.push(Number(updates.imageSize));
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    const sql = `UPDATE products SET ${setClauses.join(", ")} WHERE id = ?`;
    params.push(id);

    await query(sql, params);
    return this.findById(id);
  },

  /**
   * Delete product by ID
   */
  async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await query("DELETE FROM products WHERE id = ?", [id]);
    return existing;
  }
};

module.exports = ProductModel;
