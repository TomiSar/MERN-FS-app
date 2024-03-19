const express = require('express');
const { check } = require('express-validator');
const placesControllers = require('../controllers/places-controllers');
const router = express.Router();

// GET place byPlaceId
// http://localhost:5000/api/places/:placeId
router.get('/:placeId', placesControllers.getPlaceById);

// GET place byUserId
// http://localhost:5000/api/places/user/:userId
router.get('/user/:userId', placesControllers.getPlacesByUserId);

// POST
// http://localhost:5000/api/places/
router.post(
  '/',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty(),
  ],
  placesControllers.createPlace
);

// PATCH
// http://localhost:5000/api/places/:placeId
router.patch(
  '/:placeId',
  [check('title').notEmpty(), check('description').isLength({ min: 5 })],
  placesControllers.updatePlace
);

// DELETE
// http://localhost:5000/api/places/:placeId
router.delete('/:placeId', placesControllers.deletePlace);

module.exports = router;
