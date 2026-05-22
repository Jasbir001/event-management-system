const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlsp = bodyParser.urlencoded({ extended: false });

const port = 4002;

app.use(urlsp);
app.use(express.json()); // for JSON APIs
app.use('/api', require('./backend/routes/api'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
