const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const EXTERNAL_API_URL = 'https://jsonplaceholder.typicode.com/users';

// Hybrid state for mockup CRUD persistence
let localUsers = [];
let deletedIds = new Set();
let nextId = 11;

// GET all users
app.get('/users', async (req, res) => {
  try {
    const response = await fetch(EXTERNAL_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const externalUsers = await response.json();
    
    // Filter out deleted external users and combine with local users
    const activeExternalUsers = externalUsers.filter(user => !deletedIds.has(user.id));
    const combinedUsers = [...localUsers, ...activeExternalUsers];
    
    res.json(combinedUsers);
  } catch (error) {
    // If external service is offline, return local users at least
    if (localUsers.length > 0) {
      res.json(localUsers);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// GET single user by ID
app.get('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  
  if (deletedIds.has(userId)) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check local users first
  const localUser = localUsers.find(u => u.id === userId);
  if (localUser) {
    return res.json(localUser);
  }

  try {
    const response = await fetch(`${EXTERNAL_API_URL}/${userId}`);
    if (response.status === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create user
app.post('/users', (req, res) => {
  try {
    const newUser = {
      id: nextId++,
      name: req.body.name || 'Anonymous User',
      email: req.body.email || '',
      username: req.body.username || 'anonymous',
      phone: req.body.phone || '',
      website: req.body.website || ''
    };

    localUsers.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user
app.put('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);

  if (deletedIds.has(userId)) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check and update in local users
  const localIndex = localUsers.findIndex(u => u.id === userId);
  if (localIndex !== -1) {
    localUsers[localIndex] = { ...localUsers[localIndex], ...req.body, id: userId };
    return res.json(localUsers[localIndex]);
  }

  // Fallback to update external user (simulate update and cache locally if needed, or forward)
  try {
    // Forwarding to jsonplaceholder (which supports PUT for IDs 1-10)
    const response = await fetch(`${EXTERNAL_API_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    if (response.status === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);

  deletedIds.add(userId);
  localUsers = localUsers.filter(u => u.id !== userId);

  // JSONPlaceholder accepts delete for IDs 1-10, we call it to simulate real integration
  if (userId <= 10) {
    try {
      await fetch(`${EXTERNAL_API_URL}/${userId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      // Ignore background delete forwarding error
    }
  }

  res.status(204).send();
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };
