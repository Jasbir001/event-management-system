class LoginController {
    Login_user(req, res) {
        // Placeholder for actual login logic
        res.status(200).json({ success: true, msg: "Logged in successfully" });
    }

    createuser(req, res) {
        // Placeholder for user creation logic
        res.status(200).json({ success: true, msg: "User created successfully" });
    }
}

module.exports = new LoginController();