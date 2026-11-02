const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Jashu@2005',
  database: 'postgres'
});

client.connect(function(err){
    if (err) throw err;
    console.log("Connected to PostgreSQL!");
     /*Create a database named "mydb":*/
    client.query("CREATE DATABASE mydb", function (err, result){
        if (err) throw err;
        console.log("Database Created!");
        
    });
    
});
