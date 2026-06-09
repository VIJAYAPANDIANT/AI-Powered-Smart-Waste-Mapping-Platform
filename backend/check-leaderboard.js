const db = require('./db');

async function checkLeaderboard() {
    console.log("Checking leaderboard query...");
    try {
        const data = await db.allAsync(
            'SELECT id, username, impact_score FROM users ORDER BY impact_score DESC LIMIT 10'
        );
        console.log("Query successful!");
        console.table(data);
    } catch (error) {
        console.error("Query failed:", error.message);
    }
    process.exit(0);
}

setTimeout(checkLeaderboard, 500);
