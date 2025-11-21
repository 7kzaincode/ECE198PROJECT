'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CognitiveSession } from '@/types/cognitive';
import dayjs from 'dayjs';

export interface MemoryChartProps {
  sessions: CognitiveSession[];
  sx?: SxProps;
}

export function MemoryChart({ sessions, sx }: MemoryChartProps): React.JSX.Element {
  const theme = useTheme();
  
  // Prepare data for chart
  const chartData = sessions
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((session) => ({
      date: dayjs(session.timestamp).format('MMM DD'),
      digitSpan: session.digitSpan,
    }));

  return (
    <Card sx={sx}>
      <CardHeader title="🧠 Memory (Digit Span)" />
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
            <YAxis label={{ value: 'Digits', angle: -90, position: 'insideLeft' }} stroke={theme.palette.text.secondary} />
            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
            <Legend />
            <Bar dataKey="digitSpan" fill={theme.palette.primary.main} name="Digit Span" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

