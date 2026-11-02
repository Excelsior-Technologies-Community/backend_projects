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
	console.log('Connected!');

	// Make SQL statement:
	const sql = `
		INSERT INTO customers (name, address) VALUES
		('John', 'Highway 71'),
		('Peter', 'Lowstreet 4'),
		('Amy', 'Apple st 652'),
		('Hannah', 'Mountain 21'),
		('Michael', 'Valley 345'),
		('Sandy', 'Ocean blvd 2'),
		('Betty', 'Green Grass 1'),
		('Richard', 'Sky st 331'),
		('Susan', 'One way 98'),
		('Vicky', 'Yellow Garden 2'),
		('Ben', 'Park Lane 38'),
		('William', 'Central st 954'),
		('Chuck', 'Main Road 989'),
		('Viola', 'Sideway 1633')
	`;

	// Execute the SQL statement:
	client.query(sql, function (error, result) {
		if (error) throw error;
		console.log('Number of records inserted: ' + result.rowCount);
		client.end();
	});
});
