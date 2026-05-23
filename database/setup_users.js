const pool = require('./mydb');

const setupUsers = async () => {
    try {
        console.log("Setting up Users table...");
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                gender VARCHAR(50),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'users' table created.");
    } catch (err) {
        console.error("Error setting up users:", err);
    } finally {
        pool.end();
    }
};

setupUsers();
