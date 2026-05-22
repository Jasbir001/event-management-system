const appointmentModel = require('../Models/Appointment');
const bookingModel = require('../Models/booking');

class AppointmentController {
    Add_appointment(req, res) {
        const data = {
            Name: req.body.name,
            Email: req.body.email,
            Phone: req.body.phone,
            Time: req.body.Appointment_time,
            Address: req.body.address,
            Event: req.body.event_type
        };

        appointmentModel.create(data, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error in Book Appointment", error: err.message });
            }
            res.status(200).json({ success: true, msg: data.Name + " Appointment Booked Successfully" });
        });
    }

    Add_booking(req, res) {
        const data = {
            Name: req.body.naam || req.body.name,
            Email: req.body.email,
            Phone: req.body.phone,
            StartTime: req.body.startTime,
            EndTime: req.body.endTime,
            Apxsize: req.body.apxsize,
        };

        if (!data.StartTime || !data.EndTime) {
            return res.status(400).json({ success: false, msg: "Start Time and End Time are required." });
        }

        // 1. Check for Overlap
        bookingModel.check_overlap(data.StartTime, data.EndTime, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Database error during availability check.", error: err.message });
            }

            // 2. If overlap exists, reject the booking
            if (results && results.length > 0) {
                return res.status(409).json({ 
                    success: false, 
                    msg: "Sorry, this time slot overlaps with an existing booking. Please choose another time." 
                });
            }

            // 3. Save the new booking
            bookingModel.create(data, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, msg: "Error in Booking event. Try Again.", error: err.message });
                }
                res.status(200).json({ success: true, msg: data.Name + ", your Event is Booked successfully and is Pending Approval!" });
            });
        });
    }

    Get_bookings(req, res) {
        bookingModel.list_booking((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error fetching bookings", error: err.message });
            }
            res.status(200).json(results);
        });
    }

    Update_booking_status(req, res) {
        const id = req.params.id;
        const status = req.body.status; // 'approved' or 'rejected'
        
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, msg: "Invalid status value." });
        }

        bookingModel.update_status(id, status, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error updating status", error: err.message });
            }
            res.status(200).json({ success: true, msg: "Booking status updated to " + status });
        });
    }
}

module.exports = new AppointmentController();