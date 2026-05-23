require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Jasbir@123",
  database: process.env.DB_NAME || "event_db",
});

client.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Connected to the database.");

  const createPromotionsTable = `
    CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price_info VARCHAR(100) DEFAULT 'Free',
        event_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  client.query(createPromotionsTable, (err) => {
    if (err) {
      console.error("Error creating promotions table:", err.message);
    } else {
      console.log("Promotions table created successfully (or already exists).");
    }
    client.end();
  });
});
