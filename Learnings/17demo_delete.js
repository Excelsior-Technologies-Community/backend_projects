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
  // DELETE data record from table
  const sql = "DELETE FROM customers WHERE address = 'Blue Village 1' ";
  client.query(sql, function (error, result) {
    if (error) throw error;
    console.log("Record deleted successfully");
    console.log("Number of records deleted: " + result.rowCount);
    client.end();
  });
});
