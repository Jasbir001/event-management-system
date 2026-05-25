const pool = require("../database/mydb");

class Promotion {
  // Add a new promotional popup
  static addPromotion(title, description, price_info, event_date, result) {
    // When adding a new one, we deactivate all older ones to ensure only the latest is active
    const deactivateQuery = "UPDATE promotions SET is_active = FALSE";
    pool.query(deactivateQuery, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      
      const insertQuery = "INSERT INTO promotions (title, description, price_info, event_date, is_active) VALUES ($1, $2, $3, $4, TRUE) RETURNING id";
      pool.query(insertQuery, [title, description, price_info, event_date], (err, res2) => {
        if (err) {
          result(err, null);
          return;
        }
        result(null, { id: res2.rows[0].id, title, description, price_info, event_date });
      });
    });
  }

  // Get the currently active promotion that hasn't expired
  static getActivePromotion(result) {
    // We filter by is_active = TRUE AND event_date > NOW()
    const query = "SELECT * FROM promotions WHERE is_active = TRUE AND event_date > NOW() ORDER BY created_at DESC LIMIT 1";
    pool.query(query, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.rows.length) {
        result(null, res.rows[0]);
      } else {
        result(null, null); // No active/future promotions
      }
    });
  }
}

module.exports = Promotion;
