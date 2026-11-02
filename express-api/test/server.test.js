const test = require('node:test');
const assert = require('node:assert/strict');

let server;
let port;

test.before(async () => {
  const module = require('../server');
  server = module.server;
  port = server.address().port;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /users returns a list of users', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/users`);
  assert.equal(response.status, 200);

  const users = await response.json();
  assert.ok(Array.isArray(users));
  assert.ok(users.length > 0);
});

test('GET /users/:id returns a single user', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/users/1`);
  assert.equal(response.status, 200);

  const user = await response.json();
  assert.equal(user.id, 1);
  assert.ok(user.name);
});

test('GET /users/:id returns 404 for non-existent user', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/users/999`);
  assert.equal(response.status, 404);
  const data = await response.json();
  assert.equal(data.message, 'User not found');
});

test('POST /users creates a new user', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' }),
  });

  assert.equal(response.status, 201);
  const createdUser = await response.json();
  assert.equal(createdUser.name, 'Alice');
  assert.equal(createdUser.email, 'alice@example.com');
});

test('PUT /users/:id updates an existing user', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/users/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Updated Name' }),
  });

  assert.equal(response.status, 200);
  const updatedUser = await response.json();
  assert.equal(updatedUser.name, 'Updated Name');
});

test('DELETE /users/:id deletes a user', async () => {
  const response = await fetch(`http://127.0.0.1:${port}/users/1`, {
    method: 'DELETE',
  });

  assert.equal(response.status, 204);
});
