const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const urlsp = bodyParser.urlencoded({ extended: false });

const port = process.env.PORT || 4002;

app.use(urlsp);
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json()); // for JSON APIs

// Backend API Routes
app.use('/api', require('./backend/routes/api'));

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

if (require.main === module) {
  const initTables = require('./backend/database/init_tables');
  
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    // Automatically create database tables if they do not exist
    await initTables();
  });
}

module.exports = app;
