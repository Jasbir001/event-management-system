const db = require("../database/mydb");

const Review = {
    create: (data, callback) => {
        const q = `INSERT INTO reviews (name, role, review, rating) VALUES ($1, $2, $3, $4)`;
        db.query(q, [data.name, data.role || 'Client', data.review, data.rating || 5], (err, res) => callback(err, res ? res.rows : null));
    },
    get_all: (callback) => {
        const q = `SELECT * FROM reviews ORDER BY created_at DESC`;
        db.query(q, (err, res) => callback(err, res ? res.rows : null));
    }
}

module.exports = Review;
