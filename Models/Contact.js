const db = require('../database/mydb');

const Contact = {
    create: (data, callback) => {
        const q = `insert into contact (name, email, subject, message) values (?, ?, ?, ?)`;
        db.query(q, [data.Name, data.Email, data.Subject, data.Message], callback);
    },
    delete: (data, callback) => {
        const q = `delete from contact where id = ?`;
        db.query(q, [data.id], callback);
    },
    update: (data, callback) => {
        const q = `update contact set name = ?, subject = ?, message = ? where email = ?`;
        db.query(q, [data.Name, data.Subject, data.Message, data.email], callback);
    },
    list_contact: (callback) => {
        const q = `select * from contact`;
        db.query(q, callback);
    }
}

module.exports = Contact;
