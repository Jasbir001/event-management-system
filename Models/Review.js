const db = require("../database/mydb");

const Review = {
    create: (data, callback) => {
        const q = `INSERT INTO reviews (name, role, review, rating) VALUES (?, ?, ?, ?)`;
        db.query(q, [data.name, data.role || 'Client', data.review, data.rating || 5], callback);
    },
    get_all: (callback) => {
        const q = `SELECT * FROM reviews ORDER BY created_at DESC`;
        db.query(q, callback);
    }
}

module.exports = Review;
