const mysql = require('mysql2')

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'event_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
})

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database connected successfully ID:" + connection.threadId);
})

module.exports = pool