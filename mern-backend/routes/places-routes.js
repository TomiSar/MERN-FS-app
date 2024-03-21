const express = require('express');
const { check } = require('express-validator');
const placesController = require('../controllers/places-controllers');
const router = express.Router();

// GET place byPlaceId
// http://localhost:5000/api/places/:placeId
router.get('/:placeId', placesController.getPlaceById);

// GET place byUserId
// http://localhost:5000/api/places/user/:userId
router.get('/user/:userId', placesController.getPlacesByUserId);

// POST
// http://localhost:5000/api/places/
router.post(
  '/',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty(),
  ],
  placesController.createPlace
);

// PATCH
// http://localhost:5000/api/places/:placeId
router.patch(
  '/:placeId',
  [check('title').notEmpty(), check('description').isLength({ min: 5 })],
  placesController.updatePlace
);

// DELETE
// http://localhost:5000/api/places/:placeId
router.delete('/:placeId', placesController.deletePlace);

module.exports = router;
