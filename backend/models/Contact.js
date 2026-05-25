const db = require('../database/mydb');

const Contact = {
    create: (data, callback) => {
        const q = `insert into contact (name, email, subject, message) values ($1, $2, $3, $4)`;
        db.query(q, [data.Name, data.Email, data.Subject, data.Message], (err, res) => callback(err, res ? res.rows : null));
    },
    delete: (data, callback) => {
        const q = `delete from contact where id = $1`;
        db.query(q, [data.id], (err, res) => callback(err, res ? res.rows : null));
    },
    update: (data, callback) => {
        const q = `update contact set name = $1, subject = $2, message = $3 where email = $4`;
        db.query(q, [data.Name, data.Subject, data.Message, data.email], (err, res) => callback(err, res ? res.rows : null));
    },
    list_contact: (callback) => {
        const q = `select * from contact`;
        db.query(q, (err, res) => callback(err, res ? res.rows : null));
    }
}

module.exports = Contact;
