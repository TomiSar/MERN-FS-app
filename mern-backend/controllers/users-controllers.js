const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

// http://localhost:5000/api/
const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Maximus',
    email: 'test@test.com',
    password: 'tester',
  },
  {
    id: 'u2',
    name: 'Chuck Norris',
    email: 'chuck@sensei.com',
    password: 'sensei',
  },
  {
    id: 'u3',
    name: 'Matti Nykänen',
    email: 'masa@entertainer.com',
    password: 'entertainer',
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { name, email, password } = req.body;
  const userExists = DUMMY_USERS.find((user) => user.email === email);
  if (userExists) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);

  res
    .status(201)
    .json({ message: 'New user created successfully', user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      'Could not identify user! Check credentials (Wrong email and or password).',
      401
    );
  }

  res.status(200).json({ message: 'User logged in succesfully!' });
};

module.exports = {
  getUsers,
  signup,
  login,
};
