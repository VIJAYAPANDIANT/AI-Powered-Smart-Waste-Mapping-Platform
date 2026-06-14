const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.VERCEL
    ? path.join('/tmp', 'database.sqlite')
    : path.join(__dirname, 'database.sqlite');

// Copy template database to /tmp in Vercel environment so pre-existing data is preserved
if (process.env.VERCEL) {
    const templatePath = path.join(__dirname, 'database.sqlite');
    if (fs.existsSync(templatePath) && !fs.existsSync(dbPath)) {
        try {
            fs.copyFileSync(templatePath, dbPath);
            console.log('Successfully copied template database.sqlite to /tmp');
        } catch (err) {
            console.error('Error copying template database to /tmp:', err.message);
        }
    }
}

// Global reference to SQL instance and loaded DB in memory
let SQL;
let sqlDb;

async function getDb() {
    if (!SQL) {
        SQL = await initSqlJs();
    }
    if (!sqlDb) {
        let fileBuffer = null;
        if (fs.existsSync(dbPath)) {
            fileBuffer = fs.readFileSync(dbPath);
        }
        sqlDb = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
    }
    return sqlDb;
}

// Save memory DB to file
function persistDb() {
    if (sqlDb) {
        const data = sqlDb.export();
        fs.writeFileSync(dbPath, Buffer.from(data));
    }
}

const db = {};

db.runAsync = async function (sql, params = []) {
    const database = await getDb();
    try {
        const stmt = database.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();

        // Get last insert ID and changes
        const lastInsertIdResult = database.exec("SELECT last_insert_rowid() AS id");
        const lastID = lastInsertIdResult[0].values[0][0];

        const changesResult = database.exec("SELECT changes() AS changes");
        const changes = changesResult[0].values[0][0];

        persistDb();

        return { id: lastID, changes: changes };
    } catch (err) {
        console.error("SQL.js runAsync Error:", err);
        throw err;
    }
};

db.getAsync = async function (sql, params = []) {
    const database = await getDb();
    try {
        const stmt = database.prepare(sql);
        stmt.bind(params);
        let result = null;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        if (result && Object.keys(result).length === 0) {
            return null;
        }
        return result;
    } catch (err) {
        console.error("SQL.js getAsync Error:", err);
        throw err;
    }
};

db.allAsync = async function (sql, params = []) {
    const database = await getDb();
    try {
        const stmt = database.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
            rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
    } catch (err) {
        console.error("SQL.js allAsync Error:", err);
        throw err;
    }
};

// Initialize schema
const initSchema = async () => {
    try {
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT DEFAULT 'user',
                impact_score INTEGER DEFAULT 0,
                password TEXT
            )
        `);

        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS waste_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT,
                latitude REAL,
                longitude REAL,
                description TEXT,
                photo_url TEXT,
                category TEXT,
                timestamp TEXT,
                status TEXT DEFAULT 'pending',
                report_id TEXT,
                user_id TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);
        console.log('SQL.js SQLite schema initialized.');
    } catch (err) {
        console.error('Schema initialization error:', err.message);
    }
};

// Run initialization
initSchema();

module.exports = db;
