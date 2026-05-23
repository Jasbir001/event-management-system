const db = require("../database/mydb");

const Booking = {
    create: (data, callback) => {
        const q = `insert into booking (name, email, phone, time, end_time, apxsize, status) values ($1, $2, $3, $4, $5, $6, 'pending')`;
        db.query(q, [data.Name, data.Email, data.Phone, data.StartTime, data.EndTime, data.Apxsize], (err, res) => callback(err, res ? res.rows : null));
    },
    list_booking: (callback) => {
        const q = `select * from booking order by id desc`;
        db.query(q, (err, res) => callback(err, res ? res.rows : null));
    },
    list_user_booking: (email, callback) => {
        const q = `select * from booking where email = $1 order by id desc`;
        db.query(q, [email], (err, res) => callback(err, res ? res.rows : null));
    },
    check_overlap: (startTime, endTime, callback) => {
        const q = `select * from booking where status != 'rejected' and time < $1 and end_time > $2`;
        db.query(q, [endTime, startTime], (err, res) => callback(err, res ? res.rows : null));
    },
    update_status: (id, status, callback) => {
        const q = `update booking set status = $1 where id = $2`;
        db.query(q, [status, id], (err, res) => callback(err, res ? res.rows : null));
    },
    update_payment_status: (id, payment_status, callback) => {
        const q = `update booking set payment_status = $1 where id = $2`;
        db.query(q, [payment_status, id], (err, res) => callback(err, res ? res.rows : null));
    }
}

module.exports = Booking;
