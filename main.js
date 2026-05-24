const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const urlsp = bodyParser.urlencoded({ extended: false });

const port = 4002;

app.use(urlsp);
app.use(express.json()); // for JSON APIs

// Backend API Routes
app.use('/api', require('./backend/routes/api'));

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
