const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('./db');

async function createAdmin(username, email, password) {
    console.log(`⏳ Creating admin user in SQLite: ${username} (${email})...`);
    
    try {
        const existingUser = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            console.log('❌ Error: User with this email already exists.');
            process.exit(1);
        }

        const userId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.runAsync(
            'INSERT INTO users (id, username, email, role, password, impact_score) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, username, email, 'admin', hashedPassword, 0]
        );

        console.log(`✅ Admin profile "${username}" created successfully with ID: ${userId}`);
        console.log('You can now log in at http://localhost:3000');
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
    process.exit(0);
}

// Usage: node create-admin.js <username> <email> <password>
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node create-admin.js <username> <email> <password>');
    console.log('Example: node create-admin.js myadmin admin@test.com secret123');
    process.exit(1);
} else {
    // Wait a brief moment for database initialization
    setTimeout(() => createAdmin(args[0], args[1], args[2]), 500);
}
