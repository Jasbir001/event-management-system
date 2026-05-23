const pool = require('./mydb');

const createReviewsTable = `
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'Client',
    review TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(createReviewsTable, (err, results) => {
    if (err) {
        console.error("Error creating reviews table:", err);
    } else {
        console.log("Reviews table created or already exists.");
    }
    process.exit();
});
