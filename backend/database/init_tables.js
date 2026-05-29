const pool = require('./mydb');

const initTables = async () => {
    try {
        console.log("Initializing database tables...");

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
        console.log("✔ 'users' table ensured.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'admins' table ensured.");

        // Check if admin already exists
        const checkQuery = "SELECT * FROM admins WHERE email = $1";
        const result = await pool.query(checkQuery, ['admin@ems.com']);
        if (result.rows.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const insertQuery = "INSERT INTO admins (email, password) VALUES ($1, $2)";
            await pool.query(insertQuery, ['admin@ems.com', hashedPassword]);
            console.log("✔ Default admin created (admin@ems.com / admin123).");
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS promotions (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                price_info VARCHAR(100) DEFAULT 'Free',
                event_date TIMESTAMP NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // keep ALTERs for backward compatibility
        await pool.query(`ALTER TABLE promotions ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT 'Promotion';`);
        await pool.query(`ALTER TABLE promotions ADD COLUMN IF NOT EXISTS price_info VARCHAR(100) DEFAULT 'Free';`);
        await pool.query(`ALTER TABLE promotions ADD COLUMN IF NOT EXISTS event_date TIMESTAMP NOT NULL DEFAULT NOW();`);
        await pool.query(`ALTER TABLE promotions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;`);
        console.log("✔ 'promotions' table ensured.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) DEFAULT 'Client',
                review TEXT NOT NULL,
                rating INT NOT NULL DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'reviews' table ensured.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                apxsize VARCHAR(100),
                status VARCHAR(50) DEFAULT 'pending',
                payment_status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'bookings' table ensured.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'contact' table ensured.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointment (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                mobile VARCHAR(20),
                address TEXT,
                appointment_datetime TIMESTAMP NOT NULL,
                event_type VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'appointment' table ensured.");

        // Just in case alter is needed for existing tables without payment_status
        try {
            await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';`);
        } catch(e) {}

        console.log("Database initialization complete.");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
};

module.exports = initTables;
