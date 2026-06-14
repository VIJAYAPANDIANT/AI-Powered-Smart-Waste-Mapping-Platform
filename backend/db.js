const alasql = require('alasql');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.VERCEL
    ? path.join('/tmp', 'database.json')
    : path.join(__dirname, 'database.json');

let dbInitialized = false;

function initDb() {
    if (dbInitialized) return;

    console.log('Initializing Alasql Database...');

    // 1. Copy database.json template to /tmp on Vercel if it doesn't exist yet
    if (process.env.VERCEL) {
        const templatePath = path.join(__dirname, 'database.json');
        if (fs.existsSync(templatePath) && !fs.existsSync(dbPath)) {
            try {
                fs.copyFileSync(templatePath, dbPath);
                console.log('Successfully copied template database.json to /tmp');
            } catch (err) {
                console.error('Error copying template database.json to /tmp:', err.message);
            }
        }
    }

    // 2. Create tables
    alasql("CREATE TABLE IF NOT EXISTS users (id STRING PRIMARY KEY, username STRING, email STRING, role STRING, impact_score INT, password STRING)");
    alasql("CREATE TABLE IF NOT EXISTS waste_reports (id INT IDENTITY(1,1) PRIMARY KEY, location STRING, latitude REAL, longitude REAL, description STRING, photo_url STRING, category STRING, timestamp STRING, status STRING, report_id STRING, user_id STRING)");

    // 3. Load existing data if file exists
    if (fs.existsSync(dbPath)) {
        try {
            const rawData = fs.readFileSync(dbPath, 'utf8');
            const data = JSON.parse(rawData);
            if (data.users && Array.isArray(data.users)) {
                alasql.tables.users.data = data.users;
            }
            if (data.waste_reports && Array.isArray(data.waste_reports)) {
                alasql.tables.waste_reports.data = data.waste_reports;
                // Update identity/autoincrement sequence counter to avoid ID conflicts
                let maxId = 0;
                data.waste_reports.forEach(r => {
                    const nid = parseInt(r.id);
                    if (!isNaN(nid) && nid > maxId) maxId = nid;
                });
                alasql.tables.waste_reports.identities = { id: { value: maxId } };
            }
            console.log(`Loaded ${alasql.tables.users.data.length} users and ${alasql.tables.waste_reports.data.length} reports from JSON file.`);
        } catch (err) {
            console.error('Error loading data from database.json:', err.message);
        }
    }

    dbInitialized = true;
}

function persistDb() {
    try {
        const data = {
            users: alasql("SELECT * FROM users"),
            waste_reports: alasql("SELECT * FROM waste_reports")
        };
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error persisting database to file:', err.message);
    }
}

const db = {};

db.runAsync = async function (sql, params = []) {
    initDb();
    try {
        const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
        
        const res = alasql(sql, params);
        
        let lastID = null;
        if (isInsert) {
            const maxIdRes = alasql("SELECT MAX(id) AS id FROM waste_reports");
            lastID = maxIdRes && maxIdRes[0] ? maxIdRes[0].id : null;
        }

        persistDb();

        return { id: lastID, changes: Array.isArray(res) ? res.length : res };
    } catch (err) {
        console.error("AlaSQL runAsync Error:", err);
        throw err;
    }
};

db.getAsync = async function (sql, params = []) {
    initDb();
    try {
        const res = alasql(sql, params);
        return (res && res.length > 0) ? res[0] : null;
    } catch (err) {
        console.error("AlaSQL getAsync Error:", err);
        throw err;
    }
};

db.allAsync = async function (sql, params = []) {
    initDb();
    try {
        const res = alasql(sql, params);
        return res || [];
    } catch (err) {
        console.error("AlaSQL allAsync Error:", err);
        throw err;
    }
};

// Run initialization
initDb();

module.exports = db;
