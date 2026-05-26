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
            CREATE TABLE IF NOT EXISTS admin (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✔ 'admin' table ensured.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS promotions (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                description TEXT,
                discount_percentage INT NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
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

        // We also need the 'bookings' table, let's make sure it exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                event_name VARCHAR(255) NOT NULL,
                event_date DATE NOT NULL,
                guests INT NOT NULL,
                special_requests TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                payment_status VARCHAR(50) DEFAULT 'Pending',
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
            await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Pending';`);
        } catch(e) {}

        console.log("Database initialization complete.");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
};

module.exports = initTables;
