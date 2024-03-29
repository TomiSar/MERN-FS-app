const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const colors = require('colors');
const PORT = 5000 || process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
dotenv.config({ path: path.resolve(__dirname, './config/.env') });

// IMAGE UPLOAD
app.use('/local/images', express.static(path.join('local', 'images')));

// CORS Headers => Required for cross-origin/ cross-server communication ==> app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  // IMAGE UPLOAD
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// start Node + Express server on port 5000
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, console.log(`Server running on port ${PORT}`.rainbow));
  })
  .catch((error) => {
    console.log(error);
  });
