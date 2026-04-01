const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const db = require('../db');
const router = express.Router();

// POST /signup - Register a new user using Supabase Auth
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }

    try {
        // 1. Create user in Supabase Auth using Admin API to bypass rate limits
        const { data: authData, error: authError } = await db.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Automatically confirm to skip email limits
            user_metadata: { username }
        });

        if (authError) {
            console.error("Supabase Auth signup error:", authError);
            return res.status(400).json({ error: authError.message });
        }

        const authUser = authData.user;
        if (!authUser) {
            return res.status(500).json({ error: "Failed to create authentication user." });
        }

        // 2. Create profile in 'users' table using the same UUID
        const { data: profileData, error: profileError } = await db
            .from('users')
            .insert([
                { 
                    id: authUser.id, 
                    username, 
                    email,
                    role: 'user' // Default role
                }
            ])
            .select()
            .single();

        if (profileError) {
            console.error("Profile creation error:", profileError);
            // Consider if you want to delete the Auth user here if profile fails
            return res.status(500).json({ error: `User created but profile failed: ${profileError.message}` });
        }

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { 
                id: profileData.id, 
                username: profileData.username, 
                email: profileData.email, 
                role: profileData.role 
            } 
        });
    } catch (error) {
        console.error("Signup exception:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// POST /signin - Authenticate a user using Supabase Auth
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Hardcoded Master Admin bypass (optional: migrate this to Auth too)
    if (email === 'vijay@gmail.com' && password === '1234567890') {
        return res.json({ 
            message: "Logged in as Master Admin", 
            user: { id: 'admin-1', username: 'Vijay', email: 'vijay@gmail.com', role: 'admin' }
        });
    }

    try {
        // 1. Sign in with Supabase Auth using a FRESH client
        // This prevents the global 'db' from being polluted with a user session, 
        // which would cause RLS errors in subsequent DB calls.
        const authClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });

        const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error("Supabase Auth signin error:", authError);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 2. Fetch profile from 'users' table
        let { data: user, error: profileError } = await db
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            // Handle Case: User exists in Auth but not in 'users' table by ID
            if (profileError.code === 'PGRST116') {
                // First, check if the email already exists with a different old UUID
                const { data: existingByEmail } = await db
                    .from('users')
                    .select('*')
                    .eq('email', authData.user.email)
                    .single();

                if (existingByEmail) {
                    console.warn(`UUID desync detected for ${authData.user.email}. Re-linking profile...`);
                    // Update the users table to the new Auth UUID
                    const { data: updatedProfile, error: updateError } = await db
                        .from('users')
                        .update({ id: authData.user.id })
                        .eq('email', authData.user.email)
                        .select()
                        .single();

                    if (updateError) {
                        console.error("Profile re-linking failed:", updateError);
                        return res.status(500).json({ error: "Login successful but profile could not be re-linked." });
                    }
                    user = updatedProfile;
                } else {
                    console.warn(`Profile missing for user ${authData.user.email} (${authData.user.id}). Auto-creating...`);
                    
                    const { data: newProfile, error: createError } = await db
                        .from('users')
                        .insert([
                            { 
                                id: authData.user.id, 
                                username: authData.user.user_metadata?.username || authData.user.email.split('@')[0], 
                                email: authData.user.email,
                                role: 'user' 
                            }
                        ])
                        .select()
                        .single();

                    if (createError) {
                        console.error("Auto-profile creation failed:", createError);
                        return res.status(500).json({ error: "Login successful but profile could not be created." });
                    }
                    user = newProfile;
                }
            } else {
                console.error("Profile fetch error:", profileError);
                return res.status(500).json({ error: "Login successful but profile not found." });
            }
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
