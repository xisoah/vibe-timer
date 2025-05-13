
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { Vibe } from '@/types';
import { fetchVibesForDate, addVibeSession, updateVibeSession, deleteVibeSession } from '../lib/vibeSync';
import { formatDateToString, calculateElapsedTime } from '@/utils/timeUtils';

interface VibeContextType {
  addVibe: (name: string, color: string) => void;
  editVibe: (vibeId: string, newName: string, newColor: string) => void;
  deleteVibe: (vibeId: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTimer: (vibeId: string) => void;
  stopTimer: (vibeId: string) => void;
  selectedDateVibes: Vibe[];
  runningVibe: Vibe | null;
  refreshTimers: () => void;
  resetAllTimers: () => void;
  isToday: boolean;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

interface VibeProviderProps {
  children: ReactNode;
}

export const VibeProvider: React.FC<VibeProviderProps> = ({ children }) => {
  const { toast } = useToast();

  // Currently selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Force component refreshes for active timers
  const [refreshCounter, setRefreshCounter] = useState(0);
  // Get vibes for the currently selected date
  const [selectedDateVibes, setSelectedDateVibes] = useState<Vibe[]>([]);

  // Fetch vibes for the selected date from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = formatDateToString(selectedDate);
      const vibes = await fetchVibesForDate(formattedDate);
      setSelectedDateVibes(vibes);
    };
    fetchData();
  }, [selectedDate]);

  // Force refresh of all timers (used for updating UI)
  const refreshTimers = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Derive runningVibe from selectedDateVibes
  const runningVibe = selectedDateVibes.find(vibe => vibe.isRunning) || null;

  // Helper to check if selectedDate is today
  const isToday = React.useMemo(() => {
    const now = new Date();
    return selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();
  }, [selectedDate]);

  // Delete a vibe from Supabase for the selected date
const deleteVibe = useCallback(async (vibeId: string) => {
  const formattedDate = formatDateToString(selectedDate);
  const { error } = await deleteVibeSession(formattedDate, vibeId);
  if (error) {
    toast({
      title: "Delete Failed",
      description: error.message,
      variant: "destructive"
    });
  } else {
    toast({
      title: "Vibe Deleted",
      description: `Vibe has been deleted.`,
      variant: "default"
    });
    // Refetch vibes for the date
    const vibes = await fetchVibesForDate(formattedDate);
    setSelectedDateVibes(vibes);
    refreshTimers();
  }
}, [selectedDate, toast, refreshTimers]);

  // Edit a vibe for the selected date in Supabase
const editVibe = useCallback(async (vibeId: string, newName: string, newColor: string) => {
  const formattedDate = formatDateToString(selectedDate);
  // Find the vibe to update
  const vibe = selectedDateVibes.find(v => v.id === vibeId);
  if (!vibe) {
    toast({
      title: "Vibe Not Found",
      description: "Could not find the vibe to edit.",
      variant: "destructive"
    });
    return;
  }
  const updatedVibe = { ...vibe, name: newName, color: newColor };
  const { error } = await updateVibeSession(formattedDate, updatedVibe);
  if (error) {
    toast({
      title: "Update Failed",
      description: error.message,
      variant: "destructive"
    });
  } else {
    toast({
      title: "Vibe Updated",
      description: `Vibe name changed to '${newName}'.`,
      variant: "default"
    });
    // Refetch vibes for the date
    const vibes = await fetchVibesForDate(formattedDate);
    setSelectedDateVibes(vibes);
    refreshTimers();
  }
}, [selectedDate, selectedDateVibes, toast, refreshTimers]);

  // Add a new vibe to Supabase for the selected date
const addVibe = useCallback(async (name: string, color: string) => {
  if (!isToday) {
    toast({
      title: "View Only",
      description: "You can only add vibes for today.",
      variant: "destructive"
    });
    return;
  }
  // Check if the name already exists (case insensitive)
  const nameExists = selectedDateVibes.some(
    vibe => vibe.name.toLowerCase() === name.toLowerCase()
  );
  if (nameExists) {
    toast({
      title: "Vibe already exists",
      description: `A vibe named "${name}" already exists.`,
      variant: "destructive"
    });
    return;
  }
  const newVibe: Vibe = {
    id: uuidv4(),
    name,
    color,
    totalTime: 0,
    sessionTime: 0,
    isRunning: false,
    startTime: null
  };
  const formattedDate = formatDateToString(selectedDate);
  const { error } = await addVibeSession(formattedDate, newVibe);
  if (error) {
    toast({
      title: "Add Failed",
      description: error.message,
      variant: "destructive"
    });
  } else {
    toast({
      title: "Vibe added",
      description: `New vibe "${name}" has been added.`
    });
    // Refetch vibes for the date
    const vibes = await fetchVibesForDate(formattedDate);
    setSelectedDateVibes(vibes);
  }
}, [selectedDate, selectedDateVibes, toast, isToday]);

  // Start a timer for a specific vibe (Supabase version)
const startTimer = useCallback(async (vibeId: string) => {
  if (!isToday) {
    toast({
      title: "View Only",
      description: "You can only start timers for today.",
      variant: "destructive"
    });
    return;
  }
  const formattedDate = formatDateToString(selectedDate);
  // Stop any currently running timer
  const running = selectedDateVibes.find(v => v.isRunning);
  if (running) {
    const elapsedTime = calculateElapsedTime(running.startTime || 0);
    const updatedVibe = {
      ...running,
      totalTime: running.totalTime + elapsedTime,
      sessionTime: 0,
      isRunning: false,
      startTime: null,
    };
    await updateVibeSession(formattedDate, updatedVibe);
  }
  // Start the new timer
  const vibe = selectedDateVibes.find(v => v.id === vibeId);
  if (vibe) {
    const updatedVibe = {
      ...vibe,
      isRunning: true,
      startTime: Date.now(),
    };
    await updateVibeSession(formattedDate, updatedVibe);
    // runningVibe is now derived from selectedDateVibes
  }
  // Refetch vibes for the date
  const vibes = await fetchVibesForDate(formattedDate);
  setSelectedDateVibes(vibes);
  refreshTimers();
}, [selectedDate, selectedDateVibes, toast, isToday, refreshTimers]);

  // Stop a timer for a specific vibe (Supabase version)
const stopTimer = useCallback(async (vibeId: string) => {
  if (!isToday) {
    toast({
      title: "View Only",
      description: "You can only stop timers for today.",
      variant: "destructive"
    });
    return;
  }
  const formattedDate = formatDateToString(selectedDate);
  const vibe = selectedDateVibes.find(v => v.id === vibeId && v.isRunning);
  if (vibe) {
    const elapsedTime = calculateElapsedTime(vibe.startTime || 0);
    const updatedVibe = {
      ...vibe,
      totalTime: vibe.totalTime + elapsedTime,
      sessionTime: 0,
      isRunning: false,
      startTime: null,
    };
    await updateVibeSession(formattedDate, updatedVibe);
    // runningVibe is now derived from selectedDateVibes
  }
  // Refetch vibes for the date
  const vibes = await fetchVibesForDate(formattedDate);
  setSelectedDateVibes(vibes);
  refreshTimers();
}, [selectedDate, selectedDateVibes, toast, isToday, refreshTimers]);

  // Reset all timers for the selected date (Supabase version)
const resetAllTimers = useCallback(async () => {
  if (!isToday) {
    toast({
      title: "View Only",
      description: "You can only reset timers for today.",
      variant: "destructive"
    });
    return;
  }
  const formattedDate = formatDateToString(selectedDate);
  // Reset all vibes for the date in Supabase
  await Promise.all(selectedDateVibes.map(vibe => {
    const updatedVibe = {
      ...vibe,
      isRunning: false,
      sessionTime: 0,
      totalTime: 0,
      startTime: null
    };
    return updateVibeSession(formattedDate, updatedVibe);
  }));
  // runningVibe is now derived from selectedDateVibes
  // Refetch vibes for the date
  const vibes = await fetchVibesForDate(formattedDate);
  setSelectedDateVibes(vibes);
  refreshTimers();
}, [selectedDate, selectedDateVibes, toast, isToday, refreshTimers]);

  return (
    <VibeContext.Provider
      value={{
        addVibe,
        editVibe,
        deleteVibe,
        selectedDate,
        setSelectedDate,
        startTimer,
        stopTimer,
        selectedDateVibes,
        runningVibe,
        refreshTimers,
        resetAllTimers,
        isToday
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (context === undefined) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
};
