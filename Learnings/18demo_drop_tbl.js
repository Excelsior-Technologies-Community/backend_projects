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
  //Delete the "customers" table:
  const sql = "DROP TABLE IF EXISTS customers";
  client.query(sql, function (error, result) {
    if (error) throw error;
    // console.log("Table deleted successfully");
    console.log(result);
    client.end();
  });
});
