const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

let pool = null;
let isConnected = false;

// Create MySQL connection pool
const createPool = () => {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mysql_user_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
  });
};

/**
 * Initialize Database and Tables automatically if MySQL is running
 */
const initDB = async () => {
  const host = process.env.DB_HOST || "localhost";
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME || "mysql_user_db";

  try {
    // 1. Create a transient connection to ensure the database exists
    const rootConnection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });

    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();

    // 2. Initialize the main connection pool
    pool = createPool();

    // Test pool connection
    const connection = await pool.getConnection();

    // 3. Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`is_verified\` BOOLEAN DEFAULT FALSE,
        \`otp\` VARCHAR(10) DEFAULT NULL,
        \`otp_expires_at\` DATETIME DEFAULT NULL,
        \`otp_last_sent_at\` DATETIME DEFAULT NULL,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_users_email\` (\`email\`),
        INDEX \`idx_users_is_verified\` (\`is_verified\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Create Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(200) NOT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`price\` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        \`category\` VARCHAR(100) DEFAULT 'General',
        \`stock\` INT NOT NULL DEFAULT 0,
        \`image_url\` VARCHAR(500) NOT NULL,
        \`image_filename\` VARCHAR(255) DEFAULT NULL,
        \`image_size\` INT DEFAULT 0,
        \`created_by\` INT NOT NULL,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_products_category\` (\`category\`),
        INDEX \`idx_products_created_by\` (\`created_by\`),
        CONSTRAINT \`fk_products_user\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    connection.release();
    isConnected = true;
    console.log(`✅ [MySQL] Connected to database: '${dbName}' on ${host}:${port}`);
    console.log(`✅ [MySQL] Tables 'users' and 'products' verified and ready.`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ [MySQL] Warning: Could not connect to MySQL server (${error.message}).`);
    console.warn(`💡 Note: Database credentials can be configured anytime in .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).`);
    // Create pool anyway so when MySQL starts or credentials are provided, queries can attempt connection
    if (!pool) {
      pool = createPool();
    }
  }
};

/**
 * Execute SQL Query using connection pool
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters for prepared statement
 */
const query = async (sql, params = []) => {
  if (!pool) {
    pool = createPool();
  }
  const [results] = await pool.execute(sql, params);
  return results;
};

const getStatus = () => ({
  connected: isConnected,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || "mysql_user_db",
  user: process.env.DB_USER || "root"
});

module.exports = {
  get pool() {
    if (!pool) pool = createPool();
    return pool;
  },
  query,
  initDB,
  getStatus
};
