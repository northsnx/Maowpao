const express = require('express');
const router = express.Router();
const { authCheck } = require('../middlewares/authCheck');
const {
  getAllCats,
  getCatById,
  createCat,
  updateCat,
  deleteCat,
  adoptCat,
  getMyCats
} = require('../controllers/catModel');

// Public routes
router.get('/cats', getAllCats);
router.get('/cats/:catId', getCatById);

// Authenticated user routes
router.post('/cats', authCheck, createCat);
router.put('/cats/:catId', authCheck, updateCat);
router.delete('/cats/:catId', authCheck, deleteCat);
router.post('/cats/:catId/adopt', authCheck, adoptCat);

// User’s own cats
router.get('/cats/user/mycats', authCheck, getMyCats);

module.exports = router;
