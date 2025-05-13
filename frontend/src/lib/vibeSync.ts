import { supabase } from './supabaseClient';
import { Vibe } from '@/types';

/**
 * Adds a new vibe session row to Supabase for a given date and vibe.
 */
export async function addVibeSession(date: string, vibe: Vibe) {
  const { data, error } = await supabase
    .from('vibe_sessions')
    .insert([{
      date,
      vibe_id: vibe.id,
      name: vibe.name,
      color: vibe.color,
      total_time: vibe.totalTime,
      session_time: vibe.sessionTime,
      is_running: vibe.isRunning,
      start_time: vibe.startTime,
    }]);
  return { data, error };
}

/**
 * Updates an existing vibe session row in Supabase for a given date and vibe_id.
 */
export async function updateVibeSession(date: string, vibe: Vibe) {
  const { data, error } = await supabase
    .from('vibe_sessions')
    .update({
      name: vibe.name,
      color: vibe.color,
      total_time: vibe.totalTime,
      session_time: vibe.sessionTime,
      is_running: vibe.isRunning,
      start_time: vibe.startTime,
    })
    .eq('date', date)
    .eq('vibe_id', vibe.id);
  return { data, error };
}

/**
 * Deletes a vibe session row in Supabase for a given date and vibe_id.
 */
export async function deleteVibeSession(date: string, vibeId: string) {
  const { data, error } = await supabase
    .from('vibe_sessions')
    .delete()
    .eq('date', date)
    .eq('vibe_id', vibeId);
  return { data, error };
}

/**
 * Fetches all vibes for a given date from the Supabase vibe_sessions table.
 * @param date ISO date string (e.g., '2025-04-20')
 * @returns {Promise<Vibe[]>}
 */
export async function fetchVibesForDate(date: string): Promise<Vibe[]> {
  const { data, error } = await supabase
    .from('vibe_sessions')
    .select('*')
    .eq('date', date);
  if (error) {
    console.error('Error fetching vibes for date', date, error);
    return [];
  }
  if (!data) return [];
  // Map DB rows to Vibe objects
  return data.map((row: any) => ({
    id: row.vibe_id,
    name: row.name,
    color: row.color,
    totalTime: row.total_time,
    sessionTime: row.session_time,
    isRunning: row.is_running,
    startTime: row.start_time,
  }));
}

/**
 * Syncs all vibes for a given date to the Supabase vibe_sessions table.
 * @param date ISO date string (e.g., '2025-04-20')
 * @param vibes Array of Vibe objects for that date
 */
export async function syncVibesForDate(date: string, vibes: Vibe[]) {
  if (!Array.isArray(vibes) || vibes.length === 0) return { data: null, error: null };

  // Prepare rows for Supabase
  const rows = vibes.map(vibe => ({
    date,
    vibe_id: vibe.id,
    name: vibe.name,
    color: vibe.color,
    total_time: vibe.totalTime,
    session_time: vibe.sessionTime,
    is_running: vibe.isRunning,
    start_time: vibe.startTime,
  }));

  // Upsert to avoid duplicates for the same vibe_id/date
  const { data, error } = await supabase
    .from('vibe_sessions')
    .upsert(rows, { onConflict: 'date,vibe_id' });

  return { data, error };
}
