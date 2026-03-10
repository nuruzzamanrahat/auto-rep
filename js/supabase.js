// ============================================
// js/supabase.js - Supabase Client Config
// ============================================
// ⚠️  SETUP REQUIRED: Replace the two values below
// Found at: Supabase Dashboard → Settings → API
// ============================================

const SUPABASE_URL      = 'YOUR_SUPABASE_URL';       // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // starts with eyJ...

// Support both UMD bundle formats
const _supabaseLib = window.supabase || window.Supabase;
if (!_supabaseLib || !_supabaseLib.createClient) {
    console.error('❌ Supabase library failed to load. Check your internet connection and the CDN script tag.');
}
const db = _supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.warn('⚠️  Supabase not configured! Open js/supabase.js and set your URL and Key.');
}
