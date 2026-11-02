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
  //Sort the result by name
  //   const sql = "SELECT * FROM customers ORDER BY name";
  //   client.query(sql, function (error, result) {
  //     if (error) throw error;

  //     console.log(result.rows);
  //     client.end();
  //   });

  //here remove the fields property from the result object and log the rest of the result object to the console

  client.query("SELECT * FROM customers ORDER BY name", (error, result) => {
    if (error) throw error;

    const { fields, ...resultWithoutFields } = result;

    console.log(resultWithoutFields);

    client.end();
  });
});
