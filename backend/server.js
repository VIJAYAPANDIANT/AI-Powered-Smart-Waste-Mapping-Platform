require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { db: firestore } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Authentication Routes ---

// POST /signup - Register a new user
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    if (err.message.includes('email')) {
                        return res.status(400).json({ error: "Email already exists" });
                    }
                    return res.status(400).json({ error: "Username already exists" });
                }
                return res.status(500).json({ error: "Failed to create user" });
            }
            res.status(201).json({ 
                message: "User registered successfully", 
                user: { id: this.lastID, username, email, role: 'user', password: password } 
            });
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// POST /signin - Authenticate a user
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            // In a real app, you'd issue a JWT here. 
            // For this demo, we'll just return success and user info.
            res.json({ 
                message: "Logged in successfully", 
                user: { id: user.id, username: user.username, email: user.email, role: user.role, password: password } 
            });
        } catch (error) {
            res.status(500).json({ error: "Server error during signin" });
        }
    });
});

// --- Waste Reporting Routes (Existing) ---
app.post('/analyzeWaste', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: "Image data is required" });
        }

        // Check if API key is provided
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            console.warn("Gemini API key is missing. Using mock classification.");
            // Mock classification logic
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
        
        // Remove data:image/...;base64, prefix if present
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

// GET /reports - Fetch all waste reports
app.get('/reports', async (req, res) => {
    try {
        const reportsRef = firestore.collection('waste_reports');
        const snapshot = await reportsRef.orderBy('timestamp', 'desc').get();
        
        const reports = [];
        snapshot.forEach(doc => {
            reports.push({ id: doc.id, ...doc.data() });
        });
        
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(200).json([]); // Return empty array to avoid frontend crashes
    }
});

// POST /reportWaste - Save waste report to Firebase Firestore
app.post('/reportWaste', async (req, res) => {
    try {
        const { location, latitude, longitude, description, photo_url, timestamp, status } = req.body;
        
        const newReport = {
            location,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description,
            photo_url,
            timestamp: timestamp || new Date().toISOString(),
            status: status || 'pending',
            report_id: `REP-${Date.now()}`
        };

        const docRef = await firestore.collection('waste_reports').add(newReport);
        res.status(201).json({ message: "Report saved successfully", id: docRef.id });
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ error: "Failed to save report" });
    }
});

// DELETE /report/:id - Admin can delete reports
app.delete('/report/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await firestore.collection('waste_reports').doc(id).delete();
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: "Failed to delete report" });
    }
});

app.listen(PORT, () => {
    console.log(`SmartWaste Server is running on http://localhost:${PORT}`);
});
