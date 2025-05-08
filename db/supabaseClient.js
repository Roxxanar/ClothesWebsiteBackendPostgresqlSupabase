require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zyldhfgomockanyaptwi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;


if (!supabaseKey) {
    console.error('SUPABASE_KEY is not defined in .env');
    process.exit(1);
  }

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;