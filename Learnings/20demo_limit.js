const postgreSQL = require("pg");

const client = new postgreSQL.Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Jashu@2005",
  database: "mydb",
});

client.connect(function (error) {
  if (error) throw error;
  console.log("Connected to PostgreSQL!");
   //Return the first 5 customers:
  const sql = "SELECT * FROM customers LIMIT 5";
  client.query(sql, function (error, result) {
    if (error) throw error;
    console.log(result.rows);
    client.end();
  });
});
