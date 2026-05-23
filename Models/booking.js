const db = require("../database/mydb");

const Booking = {
    create: (data, callback) => {
        // We now insert end_time and a default status of 'pending'
        const q = `insert into booking (name, email, phone, time, end_time, apxsize, status) values (?, ?, ?, ?, ?, ?, 'pending')`;
        db.query(q, [data.Name, data.Email, data.Phone, data.StartTime, data.EndTime, data.Apxsize], callback);
    },
    list_booking: (callback) => {
        const q = `select * from booking order by id desc`;
        db.query(q, callback);
    },
    check_overlap: (startTime, endTime, callback) => {
        // A booking overlaps if (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
        // We only care about bookings that are 'pending' or 'approved'
        const q = `select * from booking where status != 'rejected' and time < ? and end_time > ?`;
        db.query(q, [endTime, startTime], callback);
    },
    update_status: (id, status, callback) => {
        const q = `update booking set status = ? where id = ?`;
        db.query(q, [status, id], callback);
    }
}

module.exports = Booking;
