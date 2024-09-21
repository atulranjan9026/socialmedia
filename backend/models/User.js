const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    socialHandle: { type: String, required: true },
    images: [{ type: String }], // Array of image file paths or URLs
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
