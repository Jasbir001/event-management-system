require('dotenv').config({ path: '../.env' });
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Jasbir@123",
  database: process.env.DB_NAME || "event_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Connected to the database.");

  const createPromotionsTable = `
    CREATE TABLE IF NOT EXISTS promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price_info VARCHAR(100) DEFAULT 'Free',
        event_date DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(createPromotionsTable, (err) => {
    if (err) {
      console.error("Error creating promotions table:", err.message);
    } else {
      console.log("Promotions table created successfully (or already exists).");
    }
    connection.end();
  });
});
