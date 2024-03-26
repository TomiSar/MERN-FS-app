const express = require('express');
const { check } = require('express-validator');
const placesController = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// http://localhost:5000/api/places/:placeId (GET place by placeId)
router.get('/:pId', placesController.getPlaceById);

// http://localhost:5000/api/places/user/:userId (GET users places by userId)
router.get('/user/:uId', placesController.getPlacesByUserId);

// CheckAuth MiddleWare
router.use(checkAuth);

// http://localhost:5000/api/places/  (POST Create new place)
router.post(
  '/',
  // THIS SHOULD BE INCLUDED WITH IMAGES
  // fileUpload.single('image'),
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty(),
  ],
  placesController.createPlace
);

// http://localhost:5000/api/places/:placeId (Patch Update existing place by placeId)
router.patch(
  '/:pId',
  [check('title').notEmpty(), check('description').isLength({ min: 5 })],
  placesController.updatePlace
);

// http://localhost:5000/api/places/:placeId (DELETE remove place by placeId)
router.delete('/:pId', placesController.deletePlace);

module.exports = router;
