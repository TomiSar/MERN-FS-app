const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// http://localhost:5000/api/

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
  const { name, email, password, places } = req.body;

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
      'User with email allready exists, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://img.ilcdn.fi/obYFZPiCH1sMlL96ooUd0Oz1QSQ=/full-fit-in/920x0/img-s3.ilcdn.fi/c5ec5e7556fc877473d87043e7effa43f95abdb0700efc32191ba449e21d37a0.jpg',
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Sign up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({
    message: 'New user created successfully',
    user: createdUser.toObject({ getters: true }),
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'User login failed! Check credentials (Wrong email and or password).',
      401
    );
    return next(error);
  }

  res.status(200).json({ message: 'User logged in succesfully!' });
};

module.exports = {
  getUsers,
  signup,
  login,
};
