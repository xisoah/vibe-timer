
/**
 * Formats seconds into a HH:MM:SS string
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

/**
 * Calculates the elapsed time in seconds between a start time and the current time
 */
export const calculateElapsedTime = (startTime: number): number => {
  if (!startTime) return 0;
  const now = Date.now();
  return Math.floor((now - startTime) / 1000);
};

/**
 * Formats a date object into YYYY-MM-DD string
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parses a YYYY-MM-DD string into a Date object
 */
export const parseStringToDate = (dateString: string): Date => {
  return new Date(dateString);
};
