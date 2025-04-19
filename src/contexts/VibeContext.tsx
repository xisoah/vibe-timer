
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { Vibe, DailyVibeData } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDateToString, calculateElapsedTime } from '@/utils/timeUtils';

// Default vibes that will be loaded on first use
const DEFAULT_VIBES = [
  { id: uuidv4(), name: "Work", totalTime: 0, sessionTime: 0, isRunning: false, startTime: null },
  { id: uuidv4(), name: "Study", totalTime: 0, sessionTime: 0, isRunning: false, startTime: null },
  { id: uuidv4(), name: "Exercise", totalTime: 0, sessionTime: 0, isRunning: false, startTime: null },
  { id: uuidv4(), name: "Social", totalTime: 0, sessionTime: 0, isRunning: false, startTime: null },
  { id: uuidv4(), name: "Self-care", totalTime: 0, sessionTime: 0, isRunning: false, startTime: null },
];

interface VibeContextType {
  availableVibes: Vibe[];
  addVibe: (name: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTimer: (vibeId: string) => void;
  stopTimer: (vibeId: string) => void;
  selectedDateVibes: Vibe[];
  runningVibe: Vibe | null;
  refreshTimers: () => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

interface VibeProviderProps {
  children: ReactNode;
}

export const VibeProvider: React.FC<VibeProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  // Store the list of all available vibes
  const [availableVibes, setAvailableVibes] = useLocalStorage<Vibe[]>('availableVibes', DEFAULT_VIBES);
  
  // Store daily vibe data records
  const [dailyVibeData, setDailyVibeData] = useLocalStorage<DailyVibeData[]>('dailyVibeData', []);
  
  // Currently selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Reference to any currently running timer
  const [runningVibe, setRunningVibe] = useState<Vibe | null>(null);
  
  // Force component refreshes for active timers
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Get vibes for the currently selected date
  const selectedDateVibes = React.useMemo(() => {
    const formattedDate = formatDateToString(selectedDate);
    const dailyData = dailyVibeData.find(data => data.date === formattedDate);
    
    if (dailyData) {
      return dailyData.vibes;
    } else {
      // If no data exists for the selected date, create a new entry with the available vibes
      const newVibes = availableVibes.map(vibe => ({
        ...vibe,
        totalTime: 0,
        sessionTime: 0,
        isRunning: false,
        startTime: null
      }));
      
      const newDailyData = {
        date: formattedDate,
        vibes: newVibes
      };
      
      setDailyVibeData(prevData => [...prevData, newDailyData]);
      return newVibes;
    }
  }, [selectedDate, dailyVibeData, availableVibes]);

  // Force refresh of all timers (used for updating UI)
  const refreshTimers = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Check on load if any timer was running and restore it
  useEffect(() => {
    // Find any running timer from the selected date
    const formattedDate = formatDateToString(selectedDate);
    const dailyData = dailyVibeData.find(data => data.date === formattedDate);
    
    if (dailyData) {
      const runningVibeFromData = dailyData.vibes.find(vibe => vibe.isRunning);
      
      if (runningVibeFromData && runningVibeFromData.startTime) {
        setRunningVibe(runningVibeFromData);
      }
    }
  }, [selectedDate, dailyVibeData]);

  // Add a new vibe
  const addVibe = useCallback((name: string) => {
    // Check if the name already exists (case insensitive)
    const nameExists = availableVibes.some(
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
      totalTime: 0,
      sessionTime: 0,
      isRunning: false,
      startTime: null
    };
    
    // Add to available vibes
    setAvailableVibes(prevVibes => [...prevVibes, newVibe]);
    
    // Add to the current day's vibes
    const formattedDate = formatDateToString(selectedDate);
    setDailyVibeData(prevData => {
      const updatedData = [...prevData];
      const dayIndex = updatedData.findIndex(data => data.date === formattedDate);
      
      if (dayIndex >= 0) {
        updatedData[dayIndex].vibes.push({ ...newVibe });
      }
      
      return updatedData;
    });
    
    toast({
      title: "Vibe added",
      description: `New vibe "${name}" has been added.`
    });
  }, [availableVibes, selectedDate, toast, setAvailableVibes, setDailyVibeData]);

  // Start a timer for a specific vibe
  const startTimer = useCallback((vibeId: string) => {
    const formattedDate = formatDateToString(selectedDate);
    
    setDailyVibeData(prevData => {
      const updatedData = [...prevData];
      const dayIndex = updatedData.findIndex(data => data.date === formattedDate);
      
      if (dayIndex >= 0) {
        // Stop any currently running timer first
        if (runningVibe) {
          const runningVibeIndex = updatedData[dayIndex].vibes.findIndex(
            vibe => vibe.id === runningVibe.id
          );
          
          if (runningVibeIndex >= 0 && updatedData[dayIndex].vibes[runningVibeIndex].isRunning) {
            const elapsedTime = calculateElapsedTime(
              updatedData[dayIndex].vibes[runningVibeIndex].startTime || 0
            );
            
            updatedData[dayIndex].vibes[runningVibeIndex].totalTime += elapsedTime;
            updatedData[dayIndex].vibes[runningVibeIndex].sessionTime = 0;
            updatedData[dayIndex].vibes[runningVibeIndex].isRunning = false;
            updatedData[dayIndex].vibes[runningVibeIndex].startTime = null;
          }
        }
        
        // Start the new timer
        const vibeIndex = updatedData[dayIndex].vibes.findIndex(vibe => vibe.id === vibeId);
        
        if (vibeIndex >= 0) {
          updatedData[dayIndex].vibes[vibeIndex].isRunning = true;
          updatedData[dayIndex].vibes[vibeIndex].startTime = Date.now();
          
          // Update running vibe reference
          setRunningVibe(updatedData[dayIndex].vibes[vibeIndex]);
        }
      }
      
      return updatedData;
    });
  }, [selectedDate, runningVibe, setDailyVibeData]);

  // Stop a timer for a specific vibe
  const stopTimer = useCallback((vibeId: string) => {
    const formattedDate = formatDateToString(selectedDate);
    
    setDailyVibeData(prevData => {
      const updatedData = [...prevData];
      const dayIndex = updatedData.findIndex(data => data.date === formattedDate);
      
      if (dayIndex >= 0) {
        const vibeIndex = updatedData[dayIndex].vibes.findIndex(vibe => vibe.id === vibeId);
        
        if (vibeIndex >= 0 && updatedData[dayIndex].vibes[vibeIndex].isRunning) {
          const elapsedTime = calculateElapsedTime(
            updatedData[dayIndex].vibes[vibeIndex].startTime || 0
          );
          
          updatedData[dayIndex].vibes[vibeIndex].totalTime += elapsedTime;
          updatedData[dayIndex].vibes[vibeIndex].sessionTime = 0;
          updatedData[dayIndex].vibes[vibeIndex].isRunning = false;
          updatedData[dayIndex].vibes[vibeIndex].startTime = null;
          
          // Clear running vibe reference
          setRunningVibe(null);
        }
      }
      
      return updatedData;
    });
  }, [selectedDate, setDailyVibeData]);

  return (
    <VibeContext.Provider
      value={{
        availableVibes,
        addVibe,
        selectedDate,
        setSelectedDate,
        startTimer,
        stopTimer,
        selectedDateVibes,
        runningVibe,
        refreshTimers
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
