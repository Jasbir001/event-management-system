const pool = require('./mydb');

const alterTable = async () => {
    try {
        console.log("Adding payment_status column to bookings table...");
        await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'`);
        console.log("✔ Added payment_status successfully.");
    } catch (err) {
        console.error("Error altering table:", err);
    } finally {
        pool.end();
    }
};

alterTable();
