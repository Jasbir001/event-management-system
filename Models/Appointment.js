const db = require("../database/mydb");

const Appointment = {
    create: (data, callback) => {
        const q = `insert into appointment (name, email, mobile, address, appointment_datetime, event_type) values ($1, $2, $3, $4, $5, $6)`;
        db.query(q, [data.Name, data.Email, data.Phone, data.Address, data.Time, data.Event], (err, res) => callback(err, res ? res.rows : null));
    },
    delete: (data, callback) => {
        const q = `delete from appointment where id = $1`;
        db.query(q, [data.id || data.email], (err, res) => callback(err, res ? res.rows : null));
    },
    list_appointment: (callback) => {
        const q = `select * from appointment`;
        db.query(q, (err, res) => callback(err, res ? res.rows : null));
    }
}

module.exports = Appointment;
