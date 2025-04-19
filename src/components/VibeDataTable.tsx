
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Vibe } from '@/types';
import { formatTime, calculateElapsedTime } from '@/utils/timeUtils';

interface VibeDataTableProps {
  vibes: Vibe[];
}

type SortDirection = 'asc' | 'desc';

const VibeDataTable: React.FC<VibeDataTableProps> = ({ vibes }) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [tick, setTick] = useState(0);

  // Set up interval for updating running timers
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate total time across all vibes
  const totalTime = vibes.reduce((acc, vibe) => {
    let time = vibe.totalTime;
    if (vibe.isRunning && vibe.startTime) {
      time += calculateElapsedTime(vibe.startTime);
    }
    return acc + time;
  }, 0);

  // Sort vibes by total time
  const sortedVibes = [...vibes].sort((a, b) => {
    const aTime = a.totalTime + (a.isRunning && a.startTime ? calculateElapsedTime(a.startTime) : 0);
    const bTime = b.totalTime + (b.isRunning && b.startTime ? calculateElapsedTime(b.startTime) : 0);
    
    return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
  });

  // Filter out vibes with no time tracked
  const filteredVibes = sortedVibes.filter(vibe => {
    const time = vibe.totalTime + (vibe.isRunning && vibe.startTime ? calculateElapsedTime(vibe.startTime) : 0);
    return time > 0;
  });

  if (filteredVibes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No time tracked yet today. Start a vibe timer to see data here.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Time tracked today</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Vibe</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={toggleSort} className="-ml-4 h-8 data-[state=open]:bg-accent">
              <span>Total Time</span>
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredVibes.map((vibe) => {
          const currentTime = vibe.totalTime + (vibe.isRunning && vibe.startTime ? calculateElapsedTime(vibe.startTime) : 0);
          
          return (
            <TableRow key={vibe.id}>
              <TableCell>{vibe.name}</TableCell>
              <TableCell className="font-mono">
                {formatTime(currentTime)}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow className="font-medium">
          <TableCell>Total</TableCell>
          <TableCell className="font-mono font-bold">
            {formatTime(totalTime)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default VibeDataTable;
