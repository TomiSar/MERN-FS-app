const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 5000 || process.env.PORT;
const app = express();

// parse application/json and MIDDLEWARE (CORS Headers => Required for cross-origin/ cross-server communication)
app.use(bodyParser.json());
app.use(cors());

// GET all users
app.get('/', (req, res, nex) => {
  try {
    res.status(200).jsonp({ message: 'This GET main endpoint' });
  } catch (error) {
    console.error(console.error());
    res.status(500).json({ message: 'Internal server error occured!' });
  }
});

// start Node + Express server on port 5000
app.listen(PORT, console.log(`Server running on port ${PORT}`));
