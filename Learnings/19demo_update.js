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
  //Update the address field:
  const sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
  client.query(sql, function (error, result) {
    if (error) throw error;
    console.log(result.rowCount + " record(s) updated");
    client.end();
  });
});
