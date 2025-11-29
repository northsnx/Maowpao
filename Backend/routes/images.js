const express = require('express');
const router = express.Router();
const { authCheck } = require('../middlewares/authCheck');
const { createImages, removeImages } = require('../controllers/images');

router.post('/images/upload', authCheck, createImages)
router.post('/images/removeimages', authCheck, removeImages)



module.exports = router;
