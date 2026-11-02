const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Jashu@2005',
    database: 'mydb'
});

client.connect(function (error) {
    if (error) throw error;
    console.log('Connected to PostgreSQL!');
    // insert a record into the "customers" table
    const sql = "INSERT INTO customers (name, address) VALUES ('Michelle', 'Blue Village 1') RETURNING id";
    client.query(sql, function (error, result) {
        if (error) throw error;
        console.log('1 record inserted with ID: ', result.rows[0].id);
        client.end();
    });
});
