const express = require('express');
const { check } = require('express-validator');
const userControllers = require('../controllers/users-controllers');
const router = express.Router();

// GET all users
// http://localhost:5000/api/users
router.get('/', userControllers.getUsers);

// POST signup new user
// http://localhost:5000/api/users/signup
router.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(), // Test@test.com => test@test.com
    // check('email').not().exists(),
    check('password').isLength({ min: 5 }),
  ],
  userControllers.signup
);

// POST login existing user
// http://localhost:5000/api/users/signup
router.post('/login', userControllers.login);

module.exports = router;
