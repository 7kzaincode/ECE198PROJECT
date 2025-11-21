'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CognitiveSession } from '@/types/cognitive';
import dayjs from 'dayjs';

export interface ReactionTimeChartProps {
  sessions: CognitiveSession[];
  sx?: SxProps;
}

export function ReactionTimeChart({ sessions, sx }: ReactionTimeChartProps): React.JSX.Element {
  const theme = useTheme();
  
  // Prepare data for chart (lower is better for reaction time)
  const chartData = sessions
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((session) => ({
      date: dayjs(session.timestamp).format('MMM DD'),
      reactionTime: session.reactionTime,
    }));

  return (
    <Card sx={sx}>
      <CardHeader title="⚡ Reaction Time Trend" />
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
            <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} stroke={theme.palette.text.secondary} />
            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="reactionTime"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              name="Reaction Time (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

