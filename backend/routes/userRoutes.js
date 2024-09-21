const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitUser } = require('../controllers/userController');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1631022242343.jpg
    }
});

const upload = multer({ storage: storage });

// Route: POST /api/users
router.post('/', upload.array('images', 10), submitUser);

module.exports = router;
