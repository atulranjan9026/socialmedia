const User = require('../models/User');

exports.submitUser = async (req, res) => {
    try {
        const { name, socialHandle } = req.body;
        const images = req.files.map(file => file.path); // Store file paths

        const newUser = new User({
            name,
            socialHandle,
            images
        });

        await newUser.save();

        res.status(201).json({ message: 'User submission successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
