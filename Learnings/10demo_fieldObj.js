const postgreSQL = require('pg');

const client = new postgreSQL.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Jashu@2005',
    database: 'mydb'
});


client.connect(function (error) {
    if (error) throw error;
    console.log('Connected to PostgreSQL!');
    //Select all customers and return the fields object:
    const sql = "SELECT * FROM customers";
    client.query(sql, function (error, result, fields) {
        if (error) throw error;
        console.log(result.fields); // result : [ Field { name: 'name', tableID: 16385, columnID: 1, dataTypeID: 1043, dataTypeSize: -1, dataTypeModifier: -1, format: 'text' },
        console.log(result.fields.map((field) => field.name)); // result : [ 'name', 'address', 'id' ]
        client.end();
    });
}); 

/*
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "myusername",
  password: "mypassword",
  database: "mydb",
  port: 5432,
});

async function getCustomers() {
  await client.connect();

  const result = await client.query("SELECT * FROM customers");

  console.log("Rows:", result.rows);
  console.log("Fields:", result.fields);

  await client.end();
}

getCustomers().catch(console.error);

*/