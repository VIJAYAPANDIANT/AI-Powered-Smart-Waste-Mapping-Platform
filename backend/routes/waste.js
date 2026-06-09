const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /analyzeWaste - Identify waste in an image using AI
router.post('/analyzeWaste', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: "Image data is required" });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || process.env.GEMINI_API_KEY === '') {
            console.warn("Gemini API key is missing. Using mock classification.");
            const categories = ['Plastic', 'Organic', 'Metal'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            return res.json({ 
                category: randomCategory, 
                confidence: 0.95,
                mock: true,
                message: "This is a mock classification because no API key was provided." 
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = "Identify the type of waste in this image. Classify it strictly into one of these categories: 'Plastic', 'Organic', 'Metal', or 'Other'. Respond with only the category name.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text().trim();
        res.json({ category: text, confidence: 1.0 });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
});

// GET /reports - Fetch all reported waste
router.get('/reports', async (req, res) => {
    try {
        const reports = await db.allAsync('SELECT * FROM waste_reports ORDER BY timestamp DESC');
        res.status(200).json(reports || []);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(200).json([]);
    }
});

// POST /reportWaste - Save a new waste report
router.post('/reportWaste', async (req, res) => {
    try {
        const { location, latitude, longitude, description, photo_url, timestamp, status, user_id, category } = req.body;
        
        const timestampVal = timestamp || new Date().toISOString();
        const statusVal = status || 'pending';
        const reportIdVal = `REP-${Date.now()}`;
        const userIdVal = user_id || null;

        const result = await db.runAsync(
            'INSERT INTO waste_reports (location, latitude, longitude, description, photo_url, category, timestamp, status, report_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                location,
                parseFloat(latitude),
                parseFloat(longitude),
                description,
                photo_url,
                category,
                timestampVal,
                statusVal,
                reportIdVal,
                userIdVal
            ]
        );

        res.status(201).json({ message: "Report saved successfully", id: result.id });
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ error: "Failed to save report" });
    }
});

// PUT /report/:id/status - Update report status and award points
router.put('/report/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        // Basic Authorization Check
        if (role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }

        // Fetch the report to get user_id and current status before updating
        const report = await db.getAsync('SELECT user_id, status FROM waste_reports WHERE id = ?', [id]);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        // Update status
        await db.runAsync('UPDATE waste_reports SET status = ? WHERE id = ?', [status, id]);

        // Gamification: Award 50 points if marked as 'resolved'
        if (status === 'resolved' && report.status !== 'resolved' && report.user_id) {
            console.log(`Awarding 50 points to user ${report.user_id}`);
            const userData = await db.getAsync('SELECT impact_score FROM users WHERE id = ?', [report.user_id]);
            if (userData) {
                const newScore = (userData.impact_score || 0) + 50;
                await db.runAsync('UPDATE users SET impact_score = ? WHERE id = ?', [newScore, report.user_id]);
            }
        }

        res.status(200).json({ message: "Report status updated successfully" });
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ error: "Failed to update report status: " + error.message });
    }
});

// GET /leaderboard - Fetch contributors ordered by impact_score
router.get('/leaderboard', async (req, res) => {
    try {
        const data = await db.allAsync('SELECT id, username, impact_score FROM users ORDER BY impact_score DESC');
        res.status(200).json(data || []);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// POST /seed - Bulk seed sample data
router.post('/seed', async (req, res) => {
    try {
        const locations = [
            { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
            { name: "Indiranagar", lat: 12.9716, lng: 77.6412 },
            { name: "HSR Layout", lat: 12.9105, lng: 77.6450 },
            { name: "Whitefield", lat: 12.9698, lng: 77.7500 }
        ];
        const statusList = ['pending', 'resolved', 'in-progress'];
        const categories = ['Plastic', 'Organic', 'Metal', 'Paper', 'Electronic'];
        
        const seedData = [];
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const status = statusList[Math.floor(Math.random() * statusList.length)];
            const cat = categories[Math.floor(Math.random() * categories.length)];
            
            seedData.push({
                location: loc.name,
                latitude: loc.lat + (Math.random() - 0.5) * 0.01,
                longitude: loc.lng + (Math.random() - 0.5) * 0.01,
                description: `${cat} waste found near ${loc.name}`,
                status: status,
                report_id: `REP-SEED-${Date.now()}-${i}`,
                timestamp: now.toISOString(),
                category: cat
            });
        }

        for (const report of seedData) {
            await db.runAsync(
                'INSERT INTO waste_reports (location, latitude, longitude, description, status, report_id, timestamp, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [report.location, report.latitude, report.longitude, report.description, report.status, report.report_id, report.timestamp, report.category]
            );
        }

        res.status(200).json({ message: "Successfully seeded 20 sample reports" });
    } catch (error) {
        console.error("Seeding error:", error);
        res.status(500).json({ error: "Failed to seed data: " + error.message });
    }
});

// DELETE /report/:id - Remove a waste report
router.delete('/report/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.runAsync('DELETE FROM waste_reports WHERE id = ?', [id]);
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: "Failed to delete report: " + error.message });
    }
});

// DELETE /reports/all - Clear all waste reports
router.delete('/reports/all', async (req, res) => {
    try {
        const { role } = req.body || {};
        
        // Basic Authorization Check
        if (role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }

        await db.runAsync('DELETE FROM waste_reports');
        res.status(200).json({ message: "All reports cleared successfully" });
    } catch (error) {
        console.error("Error clearing all reports:", error);
        res.status(500).json({ error: "Failed to clear reports: " + error.message });
    }
});

module.exports = router;
