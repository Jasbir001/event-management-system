const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const https = require('https');

const extractSenderName = (fromHeader) => {
    if (!fromHeader) return "Event Management System";
    const match = fromHeader.match(/^"([^"]+)"/);
    return match ? match[1] : "Event Management System";
};

const sendEmailViaBrevo = (mailOptions) => {
    return new Promise((resolve) => {
        const senderName = extractSenderName(mailOptions.from);
        const postData = JSON.stringify({
            sender: { name: senderName, email: process.env.EMAIL_USER || "jasbir.nexbyte@gmail.com" },
            to: [{ email: mailOptions.to }],
            subject: mailOptions.subject,
            htmlContent: mailOptions.html
        });

        const options = {
            hostname: 'api.brevo.com',
            port: 443,
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Email sent successfully via Brevo HTTP API to ${mailOptions.to}`);
                    resolve(true);
                } else {
                    console.error(`Brevo API Error (${res.statusCode}):`, body);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error("Brevo Request Error:", e.message);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
};

const createTransporter = () => {
    if (process.env.BREVO_API_KEY && process.env.BREVO_API_KEY.startsWith('xsmtpsib-')) {
        console.log("Using Brevo SMTP for email delivery...");
        return nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER || "jasbir.nexbyte@gmail.com",
                pass: process.env.BREVO_API_KEY
            }
        });
    }

    console.log("Using Gmail SMTP for email delivery...");
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendEmailSafely = async (mailOptions) => {
    try {
        if (process.env.BREVO_API_KEY) {
            if (process.env.BREVO_API_KEY.startsWith('xkeysib-')) {
                console.log("Using Brevo HTTP API for email delivery...");
                return await sendEmailViaBrevo(mailOptions);
            } else if (process.env.BREVO_API_KEY.startsWith('xsmtpsib-')) {
                console.log("Using Brevo SMTP for email delivery...");
                const transporter = createTransporter();
                await transporter.sendMail(mailOptions);
                console.log(`Email sent successfully via Brevo SMTP to ${mailOptions.to}`);
                return true;
            }
        }
        
        console.log("Using Gmail SMTP for email delivery...");
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully via Gmail SMTP to ${mailOptions.to}`);
        return true;
    } catch (error) {
        console.error("Email Delivery Error: ", error.message);
        return false;
    }
};

class EmailService {
    async sendOTP(email, otp) {
        const mailOptions = {
            from: `"Event Management System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #2563eb;">Password Reset Verification</h2>
                    <p>You requested a password reset. Use the following OTP to verify your identity:</p>
                    <h1 style="background: #f3f4f6; padding: 10px; border-radius: 6px; letter-spacing: 5px; text-align: center;">${otp}</h1>
                    <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
                </div>
            `
        };
        return await sendEmailSafely(mailOptions);
    }

    async sendBookingConfirmation(email, name, eventDetails) {
        const mailOptions = {
            from: `"Event Management System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Event Booking Received - Pending Approval',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #059669;">Booking Received!</h2>
                    <p>Hi ${name},</p>
                    <p>Your event booking has been successfully submitted and is currently <strong>Pending Approval</strong>.</p>
                    <p>We will review your booking and update the status shortly.</p>
                    <p>Thank you for choosing us!</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;"><strong>EMS Dekho Team</strong></p>
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Your Trusted Event Management Partner</p>
                </div>
            `
        };
        // Fire and forget
        sendEmailSafely(mailOptions);
    }

    async sendBookingStatusUpdate(email, name, status) {
        const color = status === 'approved' ? '#059669' : (status === 'rejected' ? '#dc2626' : '#2563eb');
        const mailOptions = {
            from: `"Event Management System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Event Booking Status Updated: ${status.toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: ${color};">Booking Status: ${status.toUpperCase()}</h2>
                    <p>Hi ${name},</p>
                    <p>The status of your event booking has been updated to <strong>${status}</strong>.</p>
                    <p>If you have any questions, please contact us.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;"><strong>EMS Dekho Team</strong></p>
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Your Trusted Event Management Partner</p>
                </div>
            `
        };
        // Fire and forget
        sendEmailSafely(mailOptions);
    }

    async sendEnquiryAcknowledgment(email, name) {
        const mailOptions = {
            from: `"Event Management System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Contact Enquiry Received',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #2563eb;">Enquiry Received</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;"><strong>EMS Dekho Team</strong></p>
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Your Trusted Event Management Partner</p>
                </div>
            `
        };
        // Fire and forget
        sendEmailSafely(mailOptions);
    }

    async sendAdminBookingNotification(bookingData) {
        const mailOptions = {
            from: `"EMS Dekho System" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Admin receives it at the configured system email
            subject: `New Event Booking Received: ${bookingData.Name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #2563eb;">New Booking Alert</h2>
                    <p>A new event booking has been submitted and is waiting for your approval.</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="border-bottom: 1px solid #eee;">${bookingData.Name}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="border-bottom: 1px solid #eee;">${bookingData.Email}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="border-bottom: 1px solid #eee;">${bookingData.Phone}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Start Time:</strong></td><td style="border-bottom: 1px solid #eee;">${new Date(bookingData.StartTime).toLocaleString()}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>End Time:</strong></td><td style="border-bottom: 1px solid #eee;">${new Date(bookingData.EndTime).toLocaleString()}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Approx Size:</strong></td><td style="border-bottom: 1px solid #eee;">${bookingData.Apxsize}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">Please login to the admin dashboard to approve or reject this booking.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;"><strong>EMS Dekho System Notification</strong></p>
                </div>
            `
        };
        // Fire and forget
        sendEmailSafely(mailOptions);
    }

    async sendPaymentReminderEmail(email, name) {
        const mailOptions = {
            from: `"EMS Dekho Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Friendly Reminder: Pending Payment for Your Event Booking',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #f59e0b;">Payment Reminder</h2>
                    <p>Dear ${name},</p>
                    <p>We hope this email finds you well.</p>
                    <p>This is a gentle reminder that there is a pending payment regarding your recent event booking with us.</p>
                    <p>To ensure all arrangements for your event proceed smoothly, we kindly request you to clear the pending dues at your earliest convenience.</p>
                    <p>If you have already made the payment, please disregard this message. Should you have any questions or need assistance, feel free to contact us.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;"><strong>EMS Dekho Team</strong></p>
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Your Trusted Event Management Partner</p>
                </div>
            `
        };
        // Fire and forget
        sendEmailSafely(mailOptions);
    }

    async sendAdminAppointmentNotification(appointmentData) {
        const mailOptions = {
            from: `"EMS Dekho System" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Appointment Request: ${appointmentData.Name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #2563eb;">New Appointment Alert</h2>
                    <p>A new appointment has been scheduled with the following details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="border-bottom: 1px solid #eee;">${appointmentData.Name}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="border-bottom: 1px solid #eee;">${appointmentData.Email}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="border-bottom: 1px solid #eee;">${appointmentData.Phone}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="border-bottom: 1px solid #eee;">${appointmentData.Time}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address:</strong></td><td style="border-bottom: 1px solid #eee;">${appointmentData.Address || 'N/A'}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Type:</strong></td><td style="border-bottom: 1px solid #eee;">${appointmentData.Event}</td></tr>
                    </table>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;"><strong>EMS Dekho System Notification</strong></p>
                </div>
            `
        };
        sendEmailSafely(mailOptions);
    }

    async sendAdminContactNotification(contactData) {
        const mailOptions = {
            from: `"EMS Dekho System" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Contact Enquiry: ${contactData.Subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
                    <h2 style="color: #2563eb;">New Contact Enquiry</h2>
                    <p>You have received a new contact request:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="border-bottom: 1px solid #eee;">${contactData.Name}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="border-bottom: 1px solid #eee;">${contactData.Email}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="border-bottom: 1px solid #eee;">${contactData.Subject}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Message:</strong></td><td style="border-bottom: 1px solid #eee;">${contactData.Message}</td></tr>
                    </table>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;"><strong>EMS Dekho System Notification</strong></p>
                </div>
            `
        };
        sendEmailSafely(mailOptions);
    }
}

module.exports = new EmailService();
