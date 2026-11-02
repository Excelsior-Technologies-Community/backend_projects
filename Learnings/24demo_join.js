const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Jashu@2005",
  database: "mydb",
});

async function getUsersWithFavorites() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    const sql = `
      SELECT
        users.name AS "user",
        products.name AS favorite
      FROM users
      JOIN products
        ON users.favorite_product = products.id
    `;

    const result = await client.query(sql);
    console.log(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

getUsersWithFavorites();
