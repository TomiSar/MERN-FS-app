const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controllers');
const router = express.Router();

// GET all users
// http://localhost:5000/api/users
router.get('/', usersController.getUsers);

// POST signup new user
// http://localhost:5000/api/users/signup

// Test@test.com => test@test.com
router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersController.signup
);
// POST login existing user
// http://localhost:5000/api/users/signup
router.post('/login', usersController.login);

module.exports = router;
