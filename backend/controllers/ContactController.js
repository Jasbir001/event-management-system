const contactModel = require('../models/Contact');
const emailService = require('../utils/emailService');

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
            emailService.sendEnquiryAcknowledgment(data.Email, data.Name);
            res.status(200).json({ success: true, msg: "Your Enquiry has been Submitted Successfully" });
        });
    }

    Get_Contacts(req, res) {
        contactModel.list_contact((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error fetching contacts", error: err.message });
            }
            res.status(200).json(results);
        });
    }

    Delete_Contact(req, res) {
        const id = req.params.id;
        contactModel.delete({ id }, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Error deleting contact", error: err.message });
            }
            res.status(200).json({ success: true, msg: "Contact inquiry resolved and deleted" });
        });
    }
}

module.exports = new ContactController();
