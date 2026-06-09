const path = require('path');
const db = require('./db');

async function checkSchema() {
    console.log("--- Detailed SQLite Schema & User Check ---");
    try {
        const users = await db.allAsync('SELECT * FROM users');
        
        console.log(`✅ Found ${users.length} users in 'users' table:`);
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Username: ${u.username}, Impact Score: ${u.impact_score}`);
        });
        
        if (users.length > 0) {
            console.log("\nColumn Types (first row):");
            Object.keys(users[0]).forEach(key => {
                console.log(`- ${key}: ${typeof users[0][key]} (value: ${users[0][key]})`);
            });
        }

        const reports = await db.allAsync('SELECT COUNT(*) as count FROM waste_reports');
        console.log(`\n✅ Found ${reports[0].count} reports in 'waste_reports' table.`);
    } catch (e) {
        console.error("Failure:", e.message);
    }
    process.exit(0);
}

// Wait a bit for DB schema init to complete
setTimeout(checkSchema, 500);
