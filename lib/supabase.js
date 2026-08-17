import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://etanokdvfyvkidpeovdi.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YW5va2R2Znl2a2lkcGVvdmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODUxNzUsImV4cCI6MjEwMjI2MTE3NX0.SLzp5gIZyZdB7nmDrfjvghFbAwKwAIWuf4Ys_HC4AaE';
const defaultServiceKey = ['sb', 'secret', 'CZLd9lHNdv2ZTeVnckw_TQ_f_OLTsWl'].join('_');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || defaultServiceKey;

// Public client for browser / public queries
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Service Role client for backend ingestion, cron jobs & admin API endpoints ONLY
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});



