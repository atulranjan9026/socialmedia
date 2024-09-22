const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// CORS Configuration
const allowedOrigins = ['https://socialmedia-f.onrender.com'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.includes(origin)){
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

// HTTP Request Logging
app.use(morgan('combined'));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Import connectDB
const connectDB = require('./connectDB');

// Connect to MongoDB
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Initialize Admin User (Run once)
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

const initializeAdmin = async () => {
    try {
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables');
        }
        const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            const admin = new Admin({
                username: process.env.ADMIN_USERNAME,
                password: hashedPassword
            });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error initializing admin user:', err);
    }
};
initializeAdmin();

// Error Handler
app.use((err, req, res, next) => {
    if (err instanceof Error && err.message.startsWith('The CORS policy')) {
        return res.status(403).json({ message: err.message });
    }
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Handle Unhandled Rejections and Exceptions
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally send process.exit(1) to terminate the server
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1); // Exit the process with failure
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
