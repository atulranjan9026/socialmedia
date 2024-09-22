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

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Route: POST /api/users
router.post('/', 
    (req, res, next) => {
        upload.array('images', 10)(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading
                return res.status(400).json({ message: err.message });
            }
            // Everything went fine
            next();
        });
    },
    // Input Validation Middleware (Optional: Using express-validator)
    async (req, res, next) => {
        const { name, socialHandle } = req.body;
        if (!name || !socialHandle) {
            // Delete uploaded files if validation fails
            if (req.files) {
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
            }
            return res.status(400).json({ message: 'Name and Social Handle are required.' });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required.' });
        }
        next();
    },
    submitUser
);

module.exports = router;
