const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are missing in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUser(emailOrId) {
    console.log(`⏳ Searching for user: ${emailOrId}...`);
    
    try {
        let authUser;
        
        // 1. Find user in Supabase Auth
        if (emailOrId.includes('@')) {
            const { data, error } = await supabase.auth.admin.listUsers();
            if (error) throw error;
            authUser = data.users.find(u => u.email === emailOrId);
        } else {
            const { data, error } = await supabase.auth.admin.getUserById(emailOrId);
            if (error) throw error;
            authUser = data.user;
        }

        if (!authUser) {
            console.error('❌ Error: User not found in Supabase Auth.');
            return;
        }

        console.log(`✅ Found Auth user: ${authUser.email} (${authUser.id})`);

        // 2. Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (existingProfile) {
            console.log(`ℹ️ Profile already exists for "${existingProfile.username}". No fix needed.`);
            return;
        }

        console.log(`⏳ Profile missing. Creating in "users" table...`);

        // 3. Create profile
        const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([
                { 
                    id: authUser.id, 
                    username: authUser.user_metadata?.username || authUser.email.split('@')[0], 
                    email: authUser.email, 
                    role: 'user' 
                }
            ])
            .select()
            .single();

        if (createError) {
            console.error('❌ Error creating profile:', createError.message);
        } else {
            console.log(`✅ Fixed! Profile "${newProfile.username}" created successfully.`);
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node fix-user.js <email_or_id>');
    console.log('Example: node fix-user.js user@example.com');
} else {
    fixUser(args[0]);
}
