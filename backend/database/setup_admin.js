const pool = require('./mydb');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
    try {
        console.log("Setting up Admin table...");
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'admins' table created.");

        // Check if admin already exists
        const checkQuery = "SELECT * FROM admins WHERE email = $1";
        const result = await pool.query(checkQuery, ['admin@ems.com']);
        
        if (result.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const insertQuery = "INSERT INTO admins (email, password) VALUES ($1, $2)";
            await pool.query(insertQuery, ['admin@ems.com', hashedPassword]);
            console.log("✔ Default admin created (admin@ems.com / admin123).");
        } else {
            console.log("✔ Admin user already exists.");
        }
        
    } catch (err) {
        console.error("Error setting up admin:", err);
    } finally {
        pool.end();
    }
};

setupAdmin();
