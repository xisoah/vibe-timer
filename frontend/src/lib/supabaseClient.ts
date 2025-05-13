import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evztfwatudhhlbfokirb.supabase.co'; // <-- paste your URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2enRmd2F0dWRoaGxiZm9raXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTgzODksImV4cCI6MjA2MDYzNDM4OX0.mVrMq3t5eJtnon4rzccXTN_Ebs0eyG8lXY1kcCxMuts'; // <-- paste your anon/public key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);