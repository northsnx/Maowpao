const express = require('express');
const router = express.Router();

const { register, getUser, login } = require('../controllers/auth');
const { authCheck } = require('../middlewares/authCheck');
const upload = require('../middlewares/uploadMiddleware');


router.post('/register', register)
router.post('/login', login)
router.get('/getUser', authCheck, getUser)
router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});
module.exports = router;