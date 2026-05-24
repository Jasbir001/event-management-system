const db = require('../database/mydb');

const User = {
    create: (data, callback) => {
        const q = `INSERT INTO users (username, email, password, gender, address) VALUES ($1, $2, $3, $4, $5)`;
        db.query(q, [data.username, data.email, data.password, data.gender, data.address], (err, res) => {
            callback(err, res ? res.rows : null);
        });
    },
    find_by_email: (email, callback) => {
        const q = "SELECT * FROM users WHERE email = $1";
        db.query(q, [email], (err, res) => {
            callback(err, res ? res.rows[0] : null);
        });
    },
    update_password: (email, hashedPassword, callback) => {
        const q = "UPDATE users SET password = $1 WHERE email = $2";
        db.query(q, [hashedPassword, email], (err, res) => {
            callback(err, res ? res.rowCount : 0);
        });
    }
};

module.exports = User;
