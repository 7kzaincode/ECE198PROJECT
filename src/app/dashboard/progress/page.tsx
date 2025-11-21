'use client';
import Alert from '@mui/material/Alert';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '@/hooks/use-user';
import { subscribeToCognitiveSessions } from '@/lib/firebase';
import type { CognitiveSession } from '@/types/cognitive';
import dayjs from 'dayjs';

export default function ProgressPage(): React.JSX.Element {
  const theme = useTheme();
  const { user } = useUser();
  const patientId = user?.id || 'patient001';
  const [sessions, setSessions] = React.useState<CognitiveSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Real-time Firestore listener
  React.useEffect(() => {
    if (!patientId) return;

    setIsLoading(true);
    
    const unsubscribe = subscribeToCognitiveSessions(patientId, (firestoreSessions) => {
      setSessions(firestoreSessions);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [patientId]);

  // Filter to last 7 days
  const recentSessions = React.useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    return sessions
      .filter((s) => s.timestamp >= cutoffDate)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [sessions]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading progress data...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // No data state
  if (sessions.length === 0) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Progress Overview</Typography>
        <Alert severity="info">
          No test data available yet. Complete cognitive tests to see your progress over time.
        </Alert>
      </Stack>
    );
  }

  // Calculate averages for the past 7 days
  const calculateAverage = (sessions: typeof recentSessions, field: keyof typeof recentSessions[0]) => {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, session) => acc + (session[field] as number), 0);
    return Math.round(sum / sessions.length);
  };

  const avgReactionTime = calculateAverage(recentSessions, 'reactionTime');
  const avgDigitSpan = calculateAverage(recentSessions, 'digitSpan');
  const avgSequenceAccuracy = calculateAverage(recentSessions, 'sequenceAccuracy');
  const avgMathScore = calculateAverage(recentSessions, 'mathScore');

  // Calculate improvement percentage (compare first and last session)
  const calculateImprovement = (sessions: typeof recentSessions, field: keyof typeof recentSessions[0], lowerIsBetter: boolean = false) => {
    if (sessions.length < 2) return 0;
    const first = sessions[0][field] as number;
    const last = sessions[sessions.length - 1][field] as number;
    if (lowerIsBetter) {
      return Math.round(((first - last) / first) * 100); // Positive = improvement
    }
    return Math.round(((last - first) / first) * 100); // Positive = improvement
  };

  const reactionTimeImprovement = calculateImprovement(recentSessions, 'reactionTime', true);
  const digitSpanImprovement = calculateImprovement(recentSessions, 'digitSpan', false);
  const sequenceAccuracyImprovement = calculateImprovement(recentSessions, 'sequenceAccuracy', false);
  const mathScoreImprovement = calculateImprovement(recentSessions, 'mathScore', false);

  // Prepare chart data
  const chartData = recentSessions.map((session) => ({
    date: dayjs(session.timestamp).format('MMM DD'),
    reactionTime: session.reactionTime,
    digitSpan: session.digitSpan,
    sequenceAccuracy: session.sequenceAccuracy,
    mathScore: session.mathScore,
  }));

  // Generate feedback message
  const generateFeedback = () => {
    const improvements = [
      { name: 'reaction time', value: reactionTimeImprovement, positive: reactionTimeImprovement > 0 },
      { name: 'memory', value: digitSpanImprovement, positive: digitSpanImprovement > 0 },
      { name: 'focus', value: sequenceAccuracyImprovement, positive: sequenceAccuracyImprovement > 0 },
      { name: 'reasoning', value: mathScoreImprovement, positive: mathScoreImprovement > 0 },
    ];

    const positiveImprovements = improvements.filter((i) => i.positive && i.value > 0);
    const bestImprovement = positiveImprovements.reduce(
      (best, current) => (current.value > best.value ? current : best),
      { name: '', value: 0, positive: true }
    );

    if (bestImprovement.value > 0) {
      return `Great progress in ${bestImprovement.name} today! You've improved by ${bestImprovement.value}% over the past week. Keep up the excellent work!`;
    }
    return 'Keep practicing! Regular cognitive exercises help maintain and improve your mental clarity.';
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Progress Overview</Typography>
      <Typography variant="body1" color="text.secondary">
        Your cognitive performance over the past 7 days
      </Typography>

      {/* Average Scores */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  ⚡ Avg Reaction Time
                </Typography>
                <Typography variant="h5">{avgReactionTime}ms</Typography>
                <Typography
                  variant="body2"
                  color={reactionTimeImprovement > 0 ? 'success.main' : reactionTimeImprovement < 0 ? 'error.main' : 'text.secondary'}
                >
                  {reactionTimeImprovement > 0 ? '+' : ''}
                  {reactionTimeImprovement}% this week
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  🧠 Avg Memory
                </Typography>
                <Typography variant="h5">{avgDigitSpan} digits</Typography>
                <Typography
                  variant="body2"
                  color={digitSpanImprovement > 0 ? 'success.main' : digitSpanImprovement < 0 ? 'error.main' : 'text.secondary'}
                >
                  {digitSpanImprovement > 0 ? '+' : ''}
                  {digitSpanImprovement}% this week
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  🎯 Avg Focus
                </Typography>
                <Typography variant="h5">{avgSequenceAccuracy}%</Typography>
                <Typography
                  variant="body2"
                  color={sequenceAccuracyImprovement > 0 ? 'success.main' : sequenceAccuracyImprovement < 0 ? 'error.main' : 'text.secondary'}
                >
                  {sequenceAccuracyImprovement > 0 ? '+' : ''}
                  {sequenceAccuracyImprovement}% this week
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  ➗ Avg Reasoning
                </Typography>
                <Typography variant="h5">{avgMathScore}%</Typography>
                <Typography
                  variant="body2"
                  color={mathScoreImprovement > 0 ? 'success.main' : mathScoreImprovement < 0 ? 'error.main' : 'text.secondary'}
                >
                  {mathScoreImprovement > 0 ? '+' : ''}
                  {mathScoreImprovement}% this week
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader title="Reaction Time Trend" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} stroke={theme.palette.text.secondary} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend />
                  <Line type="monotone" dataKey="reactionTime" stroke={theme.palette.primary.main} strokeWidth={2} name="Reaction Time" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader title="Memory (Digit Span) Trend" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader title="Focus (Sequence Accuracy) Trend" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                  <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} stroke={theme.palette.text.secondary} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend />
                  <Line type="monotone" dataKey="sequenceAccuracy" stroke={theme.palette.primary.main} strokeWidth={2} name="Sequence Accuracy" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader title="Reasoning (Math Score) Trend" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                  <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} stroke={theme.palette.text.secondary} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend />
                  <Line type="monotone" dataKey="mathScore" stroke={theme.palette.primary.main} strokeWidth={2} name="Math Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feedback Card */}
      <Card>
        <CardHeader title="Progress Feedback" />
        <CardContent>
          <Box
            sx={{
              p: 2,
              bgcolor: 'var(--mui-palette-primary-50)',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              {generateFeedback()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}

