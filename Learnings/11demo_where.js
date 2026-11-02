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
   /*Select all customers with the address "Park Lane 38":*/
  const sql = "SELECT * FROM customers WHERE address = 'Park Lane 38' ";
  client.query(sql, function (error, result) {
    if (error) throw error;
    console.log(result);
    
    client.end();
  });
});
