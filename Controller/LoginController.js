const Admin = require('../Models/Admin');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const otpStorage = new Map(); // Store OTPs in memory: { email: { otp: string, expiresAt: number } }

class LoginController {
    async Login_user(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Please provide email and password" });
        }

        // Check if Admin first
        Admin.find_by_email(email, async (err, admin) => {
            if (err) return res.status(500).json({ success: false, msg: "Database Error" });
            
            if (admin) {
                const isMatch = await bcrypt.compare(password, admin.password);
                if (isMatch) {
                    return res.status(200).json({ success: true, msg: "Admin logged in successfully", role: "admin" });
                }
            }

            // If not admin, check if regular User
            User.find_by_email(email, async (err, user) => {
                if (err) return res.status(500).json({ success: false, msg: "Database Error" });

                if (!user) {
                    return res.status(400).json({ success: false, msg: "Invalid Credentials" });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ success: false, msg: "Invalid Credentials" });
                }

                return res.status(200).json({ success: true, msg: "User logged in successfully", role: "user" });
            });
        });
    }

    async createuser(req, res) {
        const { username, email, password, gender, address } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, msg: "Please fill all required fields" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const userData = {
                username,
                email,
                password: hashedPassword,
                gender,
                address
            };

            User.create(userData, (err, result) => {
                if (err) {
                    if (err.code === '23505') { // Postgres unique violation error code
                        return res.status(400).json({ success: false, msg: "Email already exists" });
                    }
                    console.error(err);
                    return res.status(500).json({ success: false, msg: "Database Error" });
                }
                res.status(200).json({ success: true, msg: "Account created successfully! You can now login." });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: "Server Error" });
        }
    }

    async Logout_user(req, res) {
        // Since we are using stateless JWT, we just need to return a success message
        // The frontend will clear the localStorage to complete the logout
        return res.status(200).json({ success: true, msg: "Logged out successfully" });
    }

    async send_otp(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, msg: "Please provide email" });

        User.find_by_email(email, async (err, user) => {
            if (err) return res.status(500).json({ success: false, msg: "Database Error" });
            if (!user) return res.status(404).json({ success: false, msg: "No account found with that email" });

            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
            const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
            otpStorage.set(email, { otp, expiresAt });

            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

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

                await transporter.sendMail(mailOptions);
                res.status(200).json({ success: true, msg: "OTP sent to your email successfully" });
            } catch (error) {
                console.error("Nodemailer Error: ", error);
                res.status(500).json({ success: false, msg: "Failed to send OTP email. Please check server credentials." });
            }
        });
    }

    async verify_otp_and_reset(req, res) {
        const { email, otp, newPassword } = req.body;
        
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, msg: "Please provide email, OTP, and new password" });
        }

        const storedData = otpStorage.get(email);
        if (!storedData) {
            return res.status(400).json({ success: false, msg: "OTP expired or not requested" });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStorage.delete(email);
            return res.status(400).json({ success: false, msg: "OTP has expired" });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ success: false, msg: "Invalid OTP" });
        }

        User.find_by_email(email, async (err, user) => {
            if (err || !user) return res.status(500).json({ success: false, msg: "Database Error" });

            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                User.update_password(email, hashedPassword, (err, count) => {
                    if (err || count === 0) {
                        return res.status(500).json({ success: false, msg: "Failed to update password" });
                    }
                    otpStorage.delete(email); // Clear OTP on success
                    res.status(200).json({ success: true, msg: "Password has been successfully updated! You can now login." });
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, msg: "Server Error" });
            }
        });
    }
}

module.exports = new LoginController();