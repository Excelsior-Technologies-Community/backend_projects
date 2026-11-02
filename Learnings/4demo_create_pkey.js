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
   /*Create a table where the field "id" is primary key:*/
   
   /*Note: PostgreSQL does not support AUTO_INCREMENT. Instead, you can use SERIAL for auto-incrementing primary keys.*/
   
   /*Most important we created the table name customer in 3rd file so we will use ALTER for add primary key on table */

    // let sql = "CREATE TABLE customers (id SERIAL PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
    
    let sql = "ALTER TABLE customers ADD COLUMN id SERIAL PRIMARY KEY";
    client.query(sql, function (err, result){
        if (err) throw err;
        console.log("Table ALTERED Successfully!");
        
    });
    
});