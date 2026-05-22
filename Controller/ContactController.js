const contactModel = require('../Models/Contact');

class ContactController {
    Enquire_Contact(req, res) {
        const data = {
            Name: req.body.name,
            Email: req.body.email,
            Subject: req.body.subject,
            Message: req.body.message
        };

        contactModel.create(data, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: 'Something went wrong try again', error: err.message });
            }
            res.status(200).json({ success: true, msg: "Your Enquiry has been Submitted Successfully" });
        });
    }
}

module.exports = new ContactController();