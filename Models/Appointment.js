const db = require("../database/mydb");

const Appointment = {
    create: (data, callback) => {
        const q = `insert into appointment (name, email, mobile, address, appointment_datetime, event_type) values (?, ?, ?, ?, ?, ?)`;
        db.query(q, [data.Name, data.Email, data.Phone, data.Address, data.Time, data.Event], callback);
    },
    delete: (data, callback) => {
        const q = `delete from appointment where id = ?`;
        db.query(q, [data.id || data.email], callback);
    },
    list_appointment: (callback) => {
        const q = `select * from appointment`;
        db.query(q, callback);
    }
}

module.exports = Appointment;
