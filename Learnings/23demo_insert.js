const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Jashu@2005",
  database: "mydb",
});

async function insertData() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    // Make SQL statement:
    const users = `
        INSERT INTO users (name, favorite_product) VALUES
        ('John', 154),
        ('Peter', 154),
        ('Amy', 155),
        ('Hannah', 156),
        ('Michael', null)
    `;

    const usersResult = await client.query(users);
    console.log("Number of records inserted: " + usersResult.rowCount);

    const products = `
        INSERT INTO products (id, name) VALUES 
        (154, 'Chocolate Heaven' ),
        (155, 'Tasty Lemons' ),
        (156, 'Vanilla Dreams' )
    `;
    const productsResult = await client.query(products);
    console.log("Number of records inserted: " + productsResult.rowCount);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

insertData();
