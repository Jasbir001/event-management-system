const appointmentModel = require('../models/Appointment');
const bookingModel = require('../models/booking');
const emailService = require('../utils/emailService');

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

    Get_Appointments(req, res) {
        appointmentModel.list_appointment((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error fetching appointments", error: err.message });
            }
            res.status(200).json(results);
        });
    }

    Delete_Appointment(req, res) {
        const id = req.params.id;
        appointmentModel.delete({ id }, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error deleting appointment", error: err.message });
            }
            res.status(200).json({ success: true, msg: "Appointment resolved and deleted" });
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
                
                // Send email to User
                emailService.sendBookingConfirmation(data.Email, data.Name, data);
                
                // Send email to Admin
                emailService.sendAdminBookingNotification(data);

                res.status(200).json({ success: true, msg: data.Name + ", your Event is Booked successfully and is Pending Approval!" });
            });
        });
    }

    Get_bookings(req, res) {
        const role = req.query.role;
        const email = req.query.email;

        if (role === 'admin') {
            bookingModel.list_booking((err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, msg: "Error fetching bookings", error: err.message });
                }
                res.status(200).json(results);
            });
        } else {
            if (!email) {
                return res.status(400).json({ success: false, msg: "Email is required to fetch user bookings" });
            }
            bookingModel.list_user_booking(email, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, msg: "Error fetching bookings", error: err.message });
                }
                res.status(200).json(results);
            });
        }
    }

    Update_booking_status(req, res) {
        const id = req.params.id;
        const status = req.body.status;
        
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, msg: "Invalid status value." });
        }

        bookingModel.update_status(id, status, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error updating status", error: err.message });
            }
            // Fetch booking details to send email
            bookingModel.get_by_id(id, (err, booking) => {
                if (!err && booking) {
                    emailService.sendBookingStatusUpdate(booking.email, booking.name, status);
                }
            });
            res.status(200).json({ success: true, msg: "Booking status updated to " + status });
        });
    }

    Update_payment_status(req, res) {
        const id = req.params.id;
        const payment_status = req.body.payment_status;

        if (!['received', 'pending'].includes(payment_status)) {
            return res.status(400).json({ success: false, msg: "Invalid payment status value." });
        }

        bookingModel.update_payment_status(id, payment_status, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error updating payment status", error: err.message });
            }
            res.status(200).json({ success: true, msg: "Payment status updated to " + payment_status });
        });
    }

    Send_Payment_Reminder(req, res) {
        const id = req.params.id;
        
        bookingModel.get_by_id(id, (err, booking) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error fetching booking", error: err.message });
            }
            if (!booking) {
                return res.status(404).json({ success: false, msg: "Booking not found" });
            }

            emailService.sendPaymentReminderEmail(booking.email, booking.name);
            res.status(200).json({ success: true, msg: "Payment reminder sent successfully to " + booking.name });
        });
    }
}

module.exports = new AppointmentController();
