const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: GET /api/dashboard/users
router.get('/users', authMiddleware, getAllUsers);

module.exports = router;
