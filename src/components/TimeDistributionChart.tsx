
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Vibe } from '@/types';
import { calculateElapsedTime, formatTime } from '@/utils/timeUtils';

interface TimeDistributionChartProps {
  vibes: Vibe[];
}

const COLORS = ['#9b87f5', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#22C55E'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-md shadow-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm">{formatTime(payload[0].value)}</p>
        <p className="text-xs text-muted-foreground">
          {payload[0].payload.percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }

  return null;
};

const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ vibes }) => {
  const chartData = useMemo(() => {
    // Get total time from all vibes
    const totalTime = vibes.reduce((acc, vibe) => {
      const vibeTime = vibe.totalTime + (vibe.isRunning && vibe.startTime ? calculateElapsedTime(vibe.startTime) : 0);
      return acc + vibeTime;
    }, 0);

    // Create chart data only for vibes with time > 0
    return vibes
      .map(vibe => {
        const time = vibe.totalTime + (vibe.isRunning && vibe.startTime ? calculateElapsedTime(vibe.startTime) : 0);
        return {
          name: vibe.name,
          value: time,
          percentage: totalTime > 0 ? (time / totalTime) * 100 : 0
        };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [vibes]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeDistributionChart;
