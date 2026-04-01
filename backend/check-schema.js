const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkSchema() {
    console.log("--- Detailed Schema & User Check ---");
    try {
        const { data: users, error } = await supabase.from('users').select('*');
        
        if (error) {
            console.error("❌ Error fetching users:", error.message);
        } else {
            console.log(`✅ Found ${users.length} users in 'public.users' table:`);
            users.forEach(u => {
                console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Username: ${u.username}`);
            });
            
            if (users.length > 0) {
                console.log("\nColumn Types (first row):");
                Object.keys(users[0]).forEach(key => {
                    console.log(`- ${key}: ${typeof users[0][key]}`);
                });
            }
        }
    } catch (e) {
        console.error("Failure:", e.message);
    }
    process.exit(0);
}

checkSchema();
