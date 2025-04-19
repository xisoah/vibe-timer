
import React, { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Vibe } from '@/types';
import { formatTime, calculateElapsedTime } from '@/utils/timeUtils';
import { cn } from '@/lib/utils';

interface VibeCardProps {
  vibe: Vibe;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
}

const VibeCard: React.FC<VibeCardProps> = ({ vibe, onStart, onStop }) => {
  // Local state to force re-renders for timer display
  const [, setForceUpdate] = useState(0);
  
  // Set up interval for updating the timer display
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (vibe.isRunning && vibe.startTime) {
      intervalId = setInterval(() => {
        setForceUpdate(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [vibe.isRunning, vibe.startTime]);

  // Calculate the current display time (total + session if running)
  const displayTime = useMemo(() => {
    let time = vibe.totalTime;
    
    if (vibe.isRunning && vibe.startTime) {
      const sessionTime = calculateElapsedTime(vibe.startTime);
      time += sessionTime;
    }
    
    return formatTime(time);
  }, [vibe.totalTime, vibe.isRunning, vibe.startTime]);

  // Calculate the session time if running
  const sessionTime = useMemo(() => {
    if (vibe.isRunning && vibe.startTime) {
      const sessionTime = calculateElapsedTime(vibe.startTime);
      return formatTime(sessionTime);
    }
    return '00:00:00';
  }, [vibe.isRunning, vibe.startTime]);

  // Handle start/stop button click
  const handleTimerToggle = () => {
    if (vibe.isRunning) {
      onStop(vibe.id);
    } else {
      onStart(vibe.id);
    }
  };

  // Get color class based on vibe name
  const getVibeColorClass = () => {
    const name = vibe.name.toLowerCase();
    if (name.includes('work')) return 'bg-vibe-blue';
    if (name.includes('study')) return 'bg-vibe-purple';
    if (name.includes('exercise')) return 'bg-vibe-green';
    if (name.includes('social')) return 'bg-vibe-orange';
    if (name.includes('self')) return 'bg-vibe-pink';
    
    // Default colors based on the vibe id to ensure consistency
    const hash = vibe.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['bg-vibe-purple', 'bg-vibe-pink', 'bg-vibe-orange', 'bg-vibe-blue', 'bg-vibe-green'];
    return colors[hash % colors.length];
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg",
        vibe.isRunning && "ring-2 ring-primary animate-pulse-light"
      )}
    >
      <div 
        className={cn(
          "absolute top-0 left-0 w-1 h-full", 
          getVibeColorClass()
        )} 
        aria-hidden="true"
      />
      
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">{vibe.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleTimerToggle}
            className={cn(
              "transition-all duration-300",
              vibe.isRunning ? "text-red-500 hover:text-red-700 hover:bg-red-100" : 
                              "text-green-500 hover:text-green-700 hover:bg-green-100"
            )}
          >
            {vibe.isRunning ? <Pause size={20} /> : <Play size={20} />}
          </Button>
        </div>
        
        <div className="space-y-2">
          {vibe.isRunning && (
            <div className="text-sm text-muted-foreground">
              Session: <span className="font-mono">{sessionTime}</span>
            </div>
          )}
          <div className="text-xl font-mono font-bold">
            {displayTime}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        Total time tracked today
      </CardFooter>
    </Card>
  );
};

export default VibeCard;
