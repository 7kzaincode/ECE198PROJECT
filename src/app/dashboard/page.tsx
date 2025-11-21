'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid'; // ✅ MUI 7 uses this only
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ReactionTimeCard } from '@/components/dashboard/cognitive/reaction-time-card';
import { MemoryCard } from '@/components/dashboard/cognitive/memory-card';
import { FocusCard } from '@/components/dashboard/cognitive/focus-card';
import { ReasoningCard } from '@/components/dashboard/cognitive/reasoning-card';
import { ReactionTimeChart } from '@/components/dashboard/cognitive/reaction-time-chart';
import { MemoryChart } from '@/components/dashboard/cognitive/memory-chart';
import { useUser } from '@/hooks/use-user';
import { subscribeToCognitiveSessions } from '@/lib/firebase';
import type { CognitiveSession } from '@/types/cognitive';

export default function ProgressPage(): React.JSX.Element {
  const { user } = useUser();
  const [sessions, setSessions] = React.useState<CognitiveSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // fallback patient ID
  const patientId = user?.id || 'P001';

  // 🔄 Real-time listener
  React.useEffect(() => {
    if (!patientId) return;

    setIsLoading(true);
    const unsubscribe = subscribeToCognitiveSessions(patientId, (firestoreSessions) => {
      setSessions(firestoreSessions);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [patientId]);

  // Latest test
  const latestSession = sessions.length > 0 ? sessions[0] : null;

  // Utility to calculate trend
const calculateTrend = (
  current: number,
  previous: number,
  lowerIsBetter: boolean = false
): { diff: number; trend: 'up' | 'down' } | undefined => {
  if (!previous) return undefined;
  const diff = ((current - previous) / previous) * 100;

  if (lowerIsBetter) {
    return { diff: Math.abs(diff), trend: diff < 0 ? 'up' : 'down' };
  }
  return { diff: Math.abs(diff), trend: diff > 0 ? 'up' : 'down' };
};


  // Metric trends
  const reactionTimeTrend =
    sessions.length > 1
      ? calculateTrend(sessions[0].reactionTime, sessions[1].reactionTime, true)
      : undefined;
  const memoryTrend =
    sessions.length > 1
      ? calculateTrend(sessions[0].digitSpan, sessions[1].digitSpan)
      : undefined;

  // 🌀 Loading
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading cognitive test data...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // 📭 Empty
  if (!latestSession || sessions.length === 0) {
    return (
      <Stack spacing={3}>
        <Alert severity="info" sx={{ fontSize: '1rem' }}>
          No test data available yet. Complete a cognitive test to see your results here.
        </Alert>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Waiting for test data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Once you complete a cognitive test, your results will appear here automatically.
          </Typography>
        </Box>
      </Stack>
    );
  }

  // ✅ Main content
  return (
    <Stack spacing={3}>
      {/* Banner */}
      <Alert severity="info" sx={{ fontSize: '1rem' }}>
        Keep it up! Consistency improves clarity and focus.
      </Alert>

      {/* Cognitive Metric Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <ReactionTimeCard
            value={latestSession.reactionTime}
            diff={reactionTimeTrend?.diff}
            trend={reactionTimeTrend?.trend}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MemoryCard
            value={latestSession.digitSpan}
            diff={memoryTrend?.diff}
            trend={memoryTrend?.trend}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FocusCard value={latestSession.sequenceAccuracy} sx={{ height: '100%' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <ReasoningCard value={latestSession.mathScore} sx={{ height: '100%' }} />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ReactionTimeChart sessions={sessions} sx={{ height: '100%' }} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <MemoryChart sessions={sessions} sx={{ height: '100%' }} />
        </Grid>
      </Grid>
    </Stack>
  );
}
