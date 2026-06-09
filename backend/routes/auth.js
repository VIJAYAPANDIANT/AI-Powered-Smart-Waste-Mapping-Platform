const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

// POST /signup - Register a new user using SQLite
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: "User already registered" });
        }

        const userId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile in 'users' table
        await db.runAsync(
            'INSERT INTO users (id, username, email, role, password, impact_score) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, username, email, 'user', hashedPassword, 0]
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { 
                id: userId, 
                username: username, 
                email: email, 
                role: 'user' 
            } 
        });
    } catch (error) {
        console.error("Signup exception:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// POST /signin - Authenticate a user using SQLite
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Hardcoded Master Admin bypass
    if (email === 'vijay@gmail.com' && password === '1234567890') {
        // Check if the master admin user exists in the SQLite users table, if not, create it
        try {
            let adminUser = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
            if (!adminUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.runAsync(
                    'INSERT INTO users (id, username, email, role, password, impact_score) VALUES (?, ?, ?, ?, ?, ?)',
                    ['admin-1', 'Vijay', email, 'admin', hashedPassword, 0]
                );
            }
        } catch (e) {
            console.error("Error ensuring master admin exists in DB:", e);
        }

        return res.json({ 
            message: "Logged in as Master Admin", 
            user: { id: 'admin-1', username: 'Vijay', email: 'vijay@gmail.com', role: 'admin' }
        });
    }

    try {
        // Fetch user from 'users' table
        const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password || '');
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({ 
            message: "Logged in successfully", 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error("Signin exception:", error);
        res.status(500).json({ error: "Server error during signin" });
    }
});

module.exports = router;
