
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Vibe } from '@/types';
import { calculateElapsedTime, formatTime } from '@/utils/timeUtils';
import { getVibeColor } from '@/utils/vibeColor';

interface TimeDistributionChartProps {
  vibes: Vibe[];
}



import { TooltipProps } from 'recharts';

type ChartData = {
  name: string;
  value: number;
  percentage: number;
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-md shadow-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm">{formatTime(payload[0].value)}</p>
        <p className="text-xs text-muted-foreground">
          {(payload[0].payload as ChartData).percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }

  return null;
};

const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ vibes }) => {
  // Local tick state for live updates
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const anyRunning = vibes.some(vibe => vibe.isRunning && vibe.startTime);
    if (!anyRunning) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [vibes, tick]);
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
  }, [vibes, tick]);

  // Debug log for vibes and chartData

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={400}>

            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={170}
                innerRadius={90}
                dataKey="value"
                label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                  // Only show label if slice is at least 5%
                  if (percentage < 5) return null;
                  const RADIAN = Math.PI / 180;
                  // Use a radius closer to the center to avoid overflow
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      <tspan x={x} dy="-0.3em">{name}</tspan>
                      <tspan x={x} dy="1.1em">{percentage.toFixed(1)}%</tspan>
                    </text>
                  );
                }}
              >
                {chartData.map((entry) => {
                  // Find the vibe by name in vibes to get its id
                  const vibe = vibes.find(v => v.name === entry.name);
                  const color = vibe ? getVibeColor(vibe.id, vibe.name).hex : '#8884d8';
                  return <Cell key={`cell-${entry.name}`} fill={color} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
      {/* Fallback message if chartData exists but chart does not render visually */}
      {chartData.length > 0 && (
        <noscript>
          <div className="text-center text-muted-foreground mt-4">Chart could not be rendered. Please check your browser or try refreshing.</div>
        </noscript>
      )}
    </div>
  );
};

export default TimeDistributionChart;
