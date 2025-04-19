
import React, { useEffect } from 'react';
import { VibeProvider, useVibe } from '@/contexts/VibeContext';
import VibeCard from '@/components/VibeCard';
import { DatePicker } from '@/components/DatePicker';
import AddVibeDialog from '@/components/AddVibeDialog';
import VibeDataTable from '@/components/VibeDataTable';
import TimeDistributionChart from '@/components/TimeDistributionChart';

const VibeTimerApp = () => {
  const { 
    selectedDateVibes,
    startTimer,
    stopTimer,
    addVibe,
    selectedDate,
    setSelectedDate,
    refreshTimers
  } = useVibe();

  // Refresh timers when component mounts and periodically thereafter
  useEffect(() => {
    refreshTimers();
    
    const interval = setInterval(() => {
      refreshTimers();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [refreshTimers]);

  return (
    <div className="container py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vibe Timer</h1>
        <p className="text-muted-foreground">Track how you spend your time on different vibes</p>
      </header>
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-64">
            <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
          </div>
          <AddVibeDialog onAddVibe={addVibe} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {selectedDateVibes.map((vibe) => (
            <VibeCard
              key={vibe.id}
              vibe={vibe}
              onStart={startTimer}
              onStop={stopTimer}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <VibeDataTable vibes={selectedDateVibes} />
          </div>
          <div>
            <TimeDistributionChart vibes={selectedDateVibes} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <VibeProvider>
      <VibeTimerApp />
    </VibeProvider>
  );
};

export default Index;
