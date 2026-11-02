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
  //Select only "name" and "address" from "customers":
  const sql = "SELECT name, address FROM customers";
  client.query(sql, function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    console.log(result.rows[2].address + "\n", result.rows[5].address, "\n" , result.rows[8].name);
    
    client.end();
  });
});
