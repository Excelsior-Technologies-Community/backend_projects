const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Jashu@2005',
  database: 'postgres'
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL!');
  })
  .catch((error) => {
    console.error('Connection failed:', error.message);
  });