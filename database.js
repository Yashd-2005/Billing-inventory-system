const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = "inventory.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        // Create tables if they don't exist
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT,
                price REAL,
                stock INTEGER
            )`, (err) => {
                if (err) {
                    console.error("Error creating products table", err);
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS sales (
                id TEXT PRIMARY KEY,
                date TEXT,
                items TEXT,
                total REAL
            )`, (err) => {
                if (err) {
                    console.error("Error creating sales table", err);
                }
            });
        });
    }
});

module.exports = db;
