const Promotion = require("../models/Promotion");

const Add_promotion = (req, res) => {
  const { title, description, price_info, event_date } = req.body;
  if (!title || !description || !event_date) {
    return res.status(400).json({ error: "Title, description, and event date are required" });
  }

  Promotion.addPromotion(title, description, price_info || 'Free', event_date, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json({ msg: "Promotion added successfully!", data });
  });
};

const Get_active_promotion = (req, res) => {
  Promotion.getActivePromotion((err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(data);
  });
};

module.exports = {
  Add_promotion,
  Get_active_promotion
};
