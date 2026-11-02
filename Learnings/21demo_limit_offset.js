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
  //Return 5 customers, starting from position 2:
  const sql = "select * from customers limit 5 OFFSET 2";
  //const sql = "SELECT * FROM customers LIMIT 2, 5"; // not exists in PG
  client.query(sql, function (error, result) {
    if (error) throw error;
    console.log(result.rows);
    client.end();
  });
});
