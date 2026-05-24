const express = require('express');
const router = express.Router();

const AppointmentController = require('../../../Controller/AppointmentController');
const LoginController = require('../../../Controller/LoginController');
const ContactController = require('../../../Controller/ContactController');
const ReviewController = require('../../../Controller/ReviewController');

router.post('/submit_from', AppointmentController.Add_appointment.bind(AppointmentController));
router.get('/appointment', AppointmentController.Get_Appointments.bind(AppointmentController));
router.delete('/appointment/:id', AppointmentController.Delete_Appointment.bind(AppointmentController));

router.post('/login', LoginController.Login_user.bind(LoginController));
router.post('/logout', LoginController.Logout_user.bind(LoginController));
router.post('/useraccount', LoginController.createuser.bind(LoginController));
router.post('/send-otp', LoginController.send_otp.bind(LoginController));
router.post('/verify-otp', LoginController.verify_otp_and_reset.bind(LoginController));

router.post('/eventbooked', AppointmentController.Add_booking.bind(AppointmentController));

router.post('/contact', ContactController.Enquire_Contact.bind(ContactController));
router.get('/contact', ContactController.Get_Contacts.bind(ContactController));
router.delete('/contact/:id', ContactController.Delete_Contact.bind(ContactController));

router.get('/eventbooks', (req, res) => {
  const events = [
    { 
      id: 1, 
      name: 'Birthday Party', 
      description: 'Unforgettable birthday celebrations for all ages with custom themes, cake, and entertainment.',
      icon: 'party'
    },
    { 
      id: 2, 
      name: 'Night Party', 
      description: 'Exclusive night parties with premium DJ setups, lighting, and a vibrant atmosphere.',
      icon: 'music'
    },
    { 
      id: 3, 
      name: 'Corporate Gathering', 
      description: 'Professional offsites and meetings with top-tier catering, projectors, and seating arrangements.',
      icon: 'briefcase'
    },
    { 
      id: 4, 
      name: 'Family Function', 
      description: 'Intimate gatherings for families including anniversaries and reunions with beautiful decor.',
      icon: 'users'
    },
    { 
      id: 5, 
      name: 'Wedding & Reception', 
      description: 'End-to-end wedding planning including stage decoration, photography, and luxury dining.',
      icon: 'heart'
    },
    { 
      id: 6, 
      name: 'Live Entertainment', 
      description: 'Stand-up comedy, live bands, and performers to keep your guests entertained all night.',
      icon: 'mic'
    }
  ];
  res.json(events);
});

router.get('/mybooking', AppointmentController.Get_bookings.bind(AppointmentController));
router.put('/booking/:id/status', AppointmentController.Update_booking_status.bind(AppointmentController));
router.put('/booking/:id/payment', AppointmentController.Update_payment_status.bind(AppointmentController));

router.post('/reviews', ReviewController.Add_review.bind(ReviewController));
router.get('/reviews', ReviewController.Get_reviews.bind(ReviewController));

const PromotionController = require('../../../Controller/PromotionController');
router.post('/promotions', PromotionController.Add_promotion);
router.get('/promotions/active', PromotionController.Get_active_promotion);

module.exports = router;
