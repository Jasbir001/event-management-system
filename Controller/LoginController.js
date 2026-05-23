const Admin = require('../Models/Admin');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

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
}

module.exports = new LoginController();