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
//   Sort the result by name in descending order
    const sql = "SELECT * FROM customers ORDER BY name DESC";
    client.query(sql, function (error, result) {
      if (error) throw error;

      console.log(result.rows);
      client.end();
    });
});
