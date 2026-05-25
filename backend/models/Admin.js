const db = require('../database/mydb');

const Admin = {
    find_by_email: (email, callback) => {
        const q = "SELECT * FROM admins WHERE email = $1";
        db.query(q, [email], (err, res) => {
            callback(err, res ? res.rows[0] : null);
        });
    }
};

module.exports = Admin;
