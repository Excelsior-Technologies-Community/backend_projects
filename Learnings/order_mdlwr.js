const express = require('express');
const app = express();

// This middleware will run first for all requests
app.use((req, res, next) => {
  console.log('First middleware: This runs for every request');
  next();
});

// This middleware will run for /users paths only
app.use('/users', (req, res, next) => {
  console.log('Users middleware: This runs only for /users routes');
  next();
});

// This route handler will run when matched
app.get('/users', (req, res) => {
  console.log('Route handler: Handling GET /users request');
  res.send('Users list');
});

// This middleware will never run for the above matched route
// because the route handler ends the request-response cycle
app.use((req, res, next) => {
  console.log('Late middleware: This will not run for matched routes');
  next();
});

// This is a "catch-all" middleware for unmatched routes
app.use((req, res) => {
  console.log(`404 handler: No routes matched for ${req.url}`);
  res.status(404).send('Not found');
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // For demonstration, simulate requests
  // console.log('\n--- Simulation of requests ---');
  
  // Simulate request to /users
  // console.log('\nRequest to /users:');
  // console.log('First middleware: This runs for every request');
  // console.log('Users middleware: This runs only for /users routes');
  // console.log('Route handler: Handling GET /users request');
  // console.log('Response: Users list');
  
  // Simulate request to /unknown
  // console.log('\nRequest to /unknown:');
  // console.log('First middleware: This runs for every request');
  // console.log('Late middleware: This will not run for matched routes');
  // console.log('404 handler: No routes matched');
  // console.log('Response: Not found (Status: 404)');
});