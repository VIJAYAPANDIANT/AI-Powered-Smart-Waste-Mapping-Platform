const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('./db');

async function fixUser(emailOrId) {
    console.log(`⏳ Searching for user: ${emailOrId}...`);
    
    try {
        let user;
        if (emailOrId.includes('@')) {
            user = await db.getAsync('SELECT * FROM users WHERE email = ?', [emailOrId]);
        } else {
            user = await db.getAsync('SELECT * FROM users WHERE id = ?', [emailOrId]);
        }

        if (user) {
            console.log(`ℹ️ User already exists: ${user.username} (${user.email}) - ID: ${user.id}`);
            return;
        }

        console.log(`⏳ User missing. Creating default user profile...`);

        const userId = crypto.randomUUID();
        const username = emailOrId.includes('@') ? emailOrId.split('@')[0] : 'user_' + userId.slice(0, 8);
        const email = emailOrId.includes('@') ? emailOrId : username + '@test.com';
        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await db.runAsync(
            'INSERT INTO users (id, username, email, role, password, impact_score) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, username, email, 'user', hashedPassword, 0]
        );

        console.log(`✅ Fixed! Created user "${username}" (Email: ${email}) with password "${defaultPassword}".`);
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
    process.exit(0);
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node fix-user.js <email_or_id>');
    console.log('Example: node fix-user.js user@example.com');
    process.exit(1);
} else {
    setTimeout(() => fixUser(args[0]), 500);
}
