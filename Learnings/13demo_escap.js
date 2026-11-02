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
 const adr = 'Mountain 21';
  //Escape the address value:
  const sql = "SELECT * FROM customers WHERE address = $1";
  client.query(sql, [adr], function (error, result) {
    if (error) throw error;
    console.log(result);
    client.end();
  });
});
