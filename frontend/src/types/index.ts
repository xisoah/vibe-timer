
// Types for the Vibe Timer application

export interface Vibe {
  id: string;
  name: string;
  color: string; // Hex color for the vibe
  totalTime: number; // Total time tracked for a vibe on a specific date (in seconds)
  sessionTime: number; // Current session time if running (in seconds)
  isRunning: boolean;
  startTime: number | null; // Timestamp when the timer was started (in milliseconds)
}

export interface DailyVibeData {
  date: string; // ISO date string
  vibes: Vibe[];
}
