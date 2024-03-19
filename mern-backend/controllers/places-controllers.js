const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const getCoordinatesForAddress = require('../util/location');

// http://localhost:5000/api/
const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Skatepark Of Tampa',
    description: 'One of the most famous Skatepark inf Florida',
    imageUrl:
      'https://static.wixstatic.com/media/656baf_bfdfed7d67684b4485c5182f0b3cce78~mv2.jpg/v1/fill/w_830,h_414,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/SPoT-Course-2022-00007.jpg',
    location: {
      lat: 27.9661167,
      lng: -82.4130512,
    },
    address: 'E Columbus Dr, Tampa, FL 33605',
    creator: 'u1',
  },
  {
    id: 'p3',
    title: 'Lahden mäkihyppytorni',
    description: 'Most epic Ski jump tower in Lahti',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Lahti_Ski_Jumping_Hills_2.jpg/1920px-Lahti_Ski_Jumping_Hills_2.jpg',
    location: {
      lat: 60.9841003,
      lng: 25.6238777,
    },
    address: 'Suurmäenkatu 5, 15110 Lahti',
    creator: 'u2',
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId; // { pid: 'p1' }

  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place }); // => { place } => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const places = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, imageUrl, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    next(error);
  }

  // const title = req.body.title;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    imageUrl,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res
    .status(201)
    .json({ message: 'New Place created successfully', place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res
    .status(200)
    .json({ message: 'Place updated successfully', place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  // DUMMY_PLACES.filter((place) => place.id !== placeId); // => using filter
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  const deletedPlace = DUMMY_PLACES.splice(placeIndex, 1);

  res
    .status(200)
    .json({ message: 'Place deleted successfully', place: deletedPlace });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
