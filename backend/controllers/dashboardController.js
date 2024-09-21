const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ submittedAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
