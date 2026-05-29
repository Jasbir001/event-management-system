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
app.use(express.json());

app.use('/api', require('./backend/routes/api'));

if (require.main === module) {
  const initTables = require('./backend/database/init_tables');
  
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await initTables();
  });
}

module.exports = app;
