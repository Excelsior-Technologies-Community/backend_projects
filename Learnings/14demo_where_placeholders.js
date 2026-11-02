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
  const nm = "Peter";
  const adr = "Mountain 21";
  //Escape the name and the address values:
  const sql = "SELECT * FROM customers WHERE name = $1 OR address = $2";
  //Send an array with value(s) to replace the escaped values:
  client.query(sql, [nm, adr], function (error, result) {
    if (error) throw error;
    console.log(result);
    client.end();
  });
});
