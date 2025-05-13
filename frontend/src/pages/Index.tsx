
import React from 'react';
import { VibeProvider, useVibe } from '@/contexts/VibeContext';
import VibeCard from '@/components/VibeCard';
import { DatePicker } from '@/components/DatePicker';
import AddVibeDialog from '@/components/AddVibeDialog';
import ResetTimersButton from '@/components/ResetTimersButton';
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
    resetAllTimers,
    isToday
  } = useVibe();

  return (
    <div className="container py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vibe Timer</h1>
        <p className="text-muted-foreground">Track how you spend your time on different vibes</p>
      </header>
      
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <AddVibeDialog onAddVibe={addVibe} disabled={!isToday} />
    <ResetTimersButton onReset={resetAllTimers} disabled={!isToday} />
  </div>
  <div className="flex items-center">
    <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
  </div>
</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {selectedDateVibes.map((vibe) => (
            <VibeCard
              key={vibe.id}
              vibe={vibe}
              onStart={startTimer}
              onStop={stopTimer}
              disabled={!isToday}
            />
          ))}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 w-full">
  <div className="flex-1 min-w-0">
    <VibeDataTable vibes={selectedDateVibes} />
  </div>
  <div className="flex-1 min-w-0 min-h-[400px] flex items-center justify-center">
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
