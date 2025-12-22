// Load environment first
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log("=== Checking environment variables ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***SET***" : "EMPTY");
console.log("DB_NAME:", process.env.DB_NAME);

// Try to connect to MySQL directly
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME
});

console.log("\n=== Testing MySQL connection ===");
connection.connect((err) => {
  if (err) {
    console.log("❌ FULL ERROR:");
    console.log("Message:", err.message);
    console.log("Code:", err.code);
    console.log("Errno:", err.errno);
    console.log("SQL State:", err.sqlState);
  } else {
    console.log("✅ Connected successfully!");
    connection.end();
  }
  
  // Keep it open for a moment
  setTimeout(() => process.exit(0), 1000);
});
