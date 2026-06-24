const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const http = require('http');

const connectDB = require('./src/config/db');
const { initSocket } = require('./src/socket/socketHandler');

// Import modular routes
const authRoutes = require('./src/routes/authRoutes');
const wasteRoutes = require('./src/routes/wasteRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const rewardRoutes = require('./src/routes/rewardRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/events', eventRoutes);

// Root route health check
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'AI-Powered Smart Waste Mapping Platform Backend API is running successfully!',
        timestamp: new Date().toISOString()
    });
});

// Handle Static Files (Frontend)
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`SmartWaste Server is running on http://localhost:${PORT}`);
    });
}

module.exports = server;
