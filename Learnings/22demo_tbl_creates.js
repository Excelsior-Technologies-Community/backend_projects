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
    /*Create a table named "users":*/
    let user = "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), favorite_product INT)";
    client.query(user, function (err, result){
        if (err) throw err;
        console.log("Table users created Successfully!");
        
    });
    /*Create a table named "Products":*/
    let products = "CREATE TABLE Products (id SERIAL PRIMARY KEY, name VARCHAR(255))";
    client.query(products, function (err, result){
        if (err) throw err;
        console.log("Table Products created Successfully!");
        
    });
    
});