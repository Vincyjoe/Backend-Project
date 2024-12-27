// database.js
const sqlite3 = require('sqlite3').verbose();

// Create and connect to the SQLite database
const db = new sqlite3.Database('./books.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
    // Create the books table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL
      );
    `);
  }
});

module.exports = db;
