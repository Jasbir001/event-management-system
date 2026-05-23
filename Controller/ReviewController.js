const Review = require('../Models/Review');

class ReviewController {
    Add_review(req, res) {
        const data = req.body;
        if (!data.name || !data.review) {
            return res.status(400).json({ success: false, msg: "Name and review text are required" });
        }

        Review.create(data, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Database Error" });
            }
            res.status(200).json({ success: true, msg: "Review added successfully!" });
        });
    }

    Get_reviews(req, res) {
        Review.get_all((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: "Database Error" });
            }
            res.status(200).json(results);
        });
    }
}

module.exports = new ReviewController();
