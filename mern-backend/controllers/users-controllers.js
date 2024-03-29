const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User with email already exists, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const randomUserImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chuck_Norris%2C_The_Delta_Force_1986.jpg/,800px-Chuck_Norris%2C_The_Delta_Force_1986.jpg',
    'https://s.hs-data.com/bilder/spieler/gross/1683.jpg',
    'https://washingtonbus.files.wordpress.com/2010/08/untitled1.png',
    'https://www.reviewjournal.com/wp-content/uploads/2019/04/12062476_web1_CT-7110.jpg',
    'https://img.ilcdn.fi/obYFZPiCH1sMlL96ooUd0Oz1QSQ=/full-fit-in/920x0/img-s3.ilcdn.fi/c5ec5e7556fc877473d87043e7effa43f95abdb0700efc32191ba449e21d37a0.jpg',
    'https://i.media.fi/incoming/matti_nykanen.jpg/alternates/FREE_1440/matti_nykanen.jpg',
    'https://en.wikipedia.org/wiki/Steven_Seagal#/media/File:Steven_Seagal_November_2016.jpg',
    'https://www.goldderby.com/wp-content/uploads/2019/10/Ryan-Reynolds.jpg?w=640',
    'https://m.media-amazon.com/images/M/MV5BMTQ3OTY0ODk0M15BMl5BanBnXkFtZTYwNzE4Njc4._V1_FMjpg_UX1000_.jpg',
  ];
  const randIndex = Math.floor(Math.random() * randomUserImages.length);
  const randomImage = randomUserImages[randIndex];
  console.log(randomImage);

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    // image: req.file.path, // IMAGE UPLOAD
    image: randomImage,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'jwt_token_secret',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });

  // res.status(201).json({
  //   message: 'New user created successfully',
  //   user: createdUser.toObject({ getters: true }),
  //   token: token,
  // });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'User login failed! Invalid credentials (Wrong email and or password).',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'jwt_token_secret',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });

  // res.status(200).json({
  //   message: 'User logged in succesfully!',
  //   user: existingUser.toObject({ getters: true }),
  //   token: token,
  // });
};

module.exports = {
  getUsers,
  signup,
  login,
};
