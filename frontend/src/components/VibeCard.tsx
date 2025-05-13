
import React, { useMemo, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { formatTime, calculateElapsedTime } from '@/utils/timeUtils';
import { cn } from '@/lib/utils';
import { getVibeColor } from '@/utils/vibeColor';
import EditVibeDialog from '@/components/EditVibeDialog';
import { useVibe } from '@/contexts/VibeContext';

import { Vibe } from '@/types';

interface VibeCardProps {
  vibe: Vibe;
  disabled?: boolean;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
}

const VibeCard: React.FC<VibeCardProps> = ({ vibe, onStart, onStop, disabled }) => {
  // Local state to force re-renders for timer display
  const [tick, setTick] = useState(0);
  const { editVibe } = useVibe();
  const [editOpen, setEditOpen] = useState(false);

  // Set up interval for updating the timer display
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (vibe.isRunning && vibe.startTime) {
      intervalId = setInterval(() => {
        setTick(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [vibe.isRunning, vibe.startTime]);

  // Calculate the current display time (total + session if running)
   
  // 'tick' is a necessary dependency to update the timer display every second
  const displayTime = useMemo(() => {
    let time = vibe.totalTime;
    
    if (vibe.isRunning && vibe.startTime) {
      const sessionTime = calculateElapsedTime(vibe.startTime);
      time += sessionTime;
    }
    
    return formatTime(time);
  }, [vibe.totalTime, vibe.isRunning, vibe.startTime, tick]);

  // Calculate the session time if running
   
  // 'tick' is a necessary dependency to update the session timer every second
  const sessionTime = useMemo(() => {
    if (vibe.isRunning && vibe.startTime) {
      const sessionTime = calculateElapsedTime(vibe.startTime);
      return formatTime(sessionTime);
    }
    return '00:00:00';
  }, [vibe.isRunning, vibe.startTime, tick]);

  // Handle start/stop button click
  const handleTimerToggle = () => {
    if (vibe.isRunning) {
      onStop(vibe.id);
    } else {
      onStart(vibe.id);
    }
  };

  // Get color class using shared utility
  const vibeColor = getVibeColor(vibe.id, vibe.name);


  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg",
        vibe.isRunning && "ring-2 ring-primary animate-pulse-light",
        disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
      )}
      style={{ backgroundColor: vibeColor.hex }}
    >
      <div 
        className={cn(
          "absolute top-0 left-0 w-1 h-full"
        )} 
        style={{ backgroundColor: vibeColor.hex }}
        aria-hidden="true"
      />
      <CardContent
  className="pt-6 relative"
  tabIndex={0}
  onClick={event => {
    // Only trigger timer toggle if NOT clicking the Edit button or its children
    const el = event.target as Element;
    if (
      !el.closest('.edit-vibe-btn') &&
      !disabled
    ) {
      handleTimerToggle();
    }
  }}
  onKeyDown={event => {
    const el = event.target as Element;
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      !el.closest('.edit-vibe-btn') &&
      !disabled
    ) {
      handleTimerToggle();
    }
  }}
> 
        {/* Make entire card clickable except for Edit button */}
        <div className="flex justify-between items-center mb-2 relative z-0 pointer-events-auto">
          <h3 className="text-lg font-medium">{vibe.name}</h3>
          {!disabled && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Edit Vibe"
              className="ml-2 z-20 edit-vibe-btn"
              onClick={e => {
                e.preventDefault();
                setEditOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2 relative z-0 pointer-events-auto">
          <div className="text-sm text-muted-foreground">
            Session: <span className="font-mono">{sessionTime}</span>
          </div>
          <div className="text-xl font-mono font-bold">
            {displayTime}
          </div>
        </div>
      </CardContent>
      <EditVibeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialName={vibe.name}
        initialColor={vibe.color}
        onSubmit={(newName, newColor) => editVibe(vibe.id, newName, newColor)}
        vibeId={vibe.id}
      />
    </Card>
  );
};

export default VibeCard;
