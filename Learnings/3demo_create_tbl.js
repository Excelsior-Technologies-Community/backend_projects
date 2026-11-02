const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Jashu@2005',
  database: 'mydb'
});

client.connect(function(err){
    if (err) throw err;
    console.log("Connected to PostgreSQL!");
    /*Create a table named "customers":*/
    let sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    client.query(sql, function (err, result){
        if (err) throw err;
        console.log("Table Created Successfully!");
        
    });
    
});

// ASYNC execution example

// const { Client } = require('pg');

// const client = new Client({
//   host: 'localhost',
//   port: 5432,
//   user: 'postgres',
//   password: 'your_password',
//   database: 'mydb'
// });

// client.connect(async (error) => {
//   if (error) throw error;

//   console.log('Connected to PostgreSQL!');

//   await client.query(`
//     CREATE TABLE IF NOT EXISTS customers (
//       name VARCHAR(255),
//       address VARCHAR(255)
//     )
//   `);

//   console.log('Table created successfully!');
//   await client.end();
// });