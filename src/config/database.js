const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Path to your SQLite database file
const dbPath = path.join(__dirname, '../../database.db');
console.log(`📁 Database location: ${dbPath}`);

// Create database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    createTables();
  }
});

// Create all necessary tables
function createTables() {
  db.serialize(() => {
    // 1. Users table (for admin login)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'employee',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) console.error('Error creating users table:', err);
    });

    // 2. Contacts table (with ALL your new form fields)
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      job_title TEXT NOT NULL DEFAULT 'Other',
      email TEXT NOT NULL,
      phone TEXT,
      country TEXT NOT NULL DEFAULT 'United States',
      company TEXT,
      requirements TEXT NOT NULL,
      source TEXT,
      privacy_consent INTEGER DEFAULT 0, -- SQLite uses 0/1 for booleans
      newsletter INTEGER DEFAULT 0,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )`, (err) => {
      if (err) console.error('Error creating contacts table:', err);
    });

    // 3. Create admin user if it doesn't exist
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
      if (err) {
        console.error('Error checking admin user:', err);
        return;
      }
      
      if (!row) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          ['admin', 'admin@aisolution.com', hashedPassword, 'admin'],
          (err) => {
            if (err) {
              console.error('❌ Error creating admin user:', err);
            } else {
              console.log('✅ Default admin user created');
              console.log('👤 Username: admin');
              console.log('🔑 Password: admin123');
            }
          }
        );
      } else {
        console.log('✅ Admin user already exists');
      }
    });

    // 4. Create other tables you might need
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      price REAL,
      features TEXT,
      image TEXT,
      is_popular INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      rating REAL DEFAULT 0
    )`);

    console.log('✅ All database tables are ready');
  });
}

// Helper functions for async/await support
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = db;