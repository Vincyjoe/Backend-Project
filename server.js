// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

// Initialize Express app
const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// CREATE: Add a new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  const query = 'INSERT INTO books (title, author) VALUES (?, ?)';

  db.run(query, [title, author], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error adding book', error: err.message });
    }
    res.status(201).json({ message: 'Book added', bookId: this.lastID });
  });
});

// READ: Get all books
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
    res.status(200).json(rows);
  });
});

// READ: Get a book by ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching book', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(row);
  });
});

// UPDATE: Update a book by ID
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const query = 'UPDATE books SET title = ?, author = ? WHERE id = ?';

  db.run(query, [title, author, id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating book', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated' });
  });
});

// DELETE: Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting book', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
