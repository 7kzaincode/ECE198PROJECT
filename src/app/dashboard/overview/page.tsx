'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';

import { useUser } from '@/hooks/use-user';
import { subscribeToCognitiveSessions } from '@/lib/firebase';
import type { CognitiveSession } from '@/types/cognitive';

type SortField =
  | 'timestamp'
  | 'reactionTime'
  | 'digitSpan'
  | 'sequenceAccuracy'
  | 'mathScore';
type SortDirection = 'asc' | 'desc';

export default function OverviewPage(): React.JSX.Element {
  const { user } = useUser();
  const patientId = user?.id || 'patient001';
  const [sortField, setSortField] = React.useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [sessions, setSessions] = React.useState<CognitiveSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // 🔄 Real-time Firestore listener
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSessions = React.useMemo(() => {
    return [...sessions].sort((a, b) => {
      let aValue: number | Date;
      let bValue: number | Date;

      switch (sortField) {
        case 'timestamp':
          aValue = a.timestamp;
          bValue = b.timestamp;
          break;
        case 'reactionTime':
          aValue = a.reactionTime;
          bValue = b.reactionTime;
          break;
        case 'digitSpan':
          aValue = a.digitSpan;
          bValue = b.digitSpan;
          break;
        case 'sequenceAccuracy':
          aValue = a.sequenceAccuracy;
          bValue = b.sequenceAccuracy;
          break;
        case 'mathScore':
          aValue = a.mathScore;
          bValue = b.mathScore;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sessions, sortField, sortDirection]);

  // 🌀 Loading state
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
            Loading test sessions...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Data Overview</Typography>
      <Typography variant="body1" color="text.secondary">
        View all your cognitive test sessions. Click column headers to sort. Data updates automatically when new tests are completed.
      </Typography>

      {sessions.length === 0 ? (
        <Alert severity="info">
          No test sessions found. Complete a cognitive test to see your results here.
        </Alert>
      ) : (
        <Card>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'timestamp'}
                      direction={sortField === 'timestamp' ? sortDirection : 'asc'}
                      onClick={() => handleSort('timestamp')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'reactionTime'}
                      direction={sortField === 'reactionTime' ? sortDirection : 'asc'}
                      onClick={() => handleSort('reactionTime')}
                    >
                      Reaction Time (ms)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'digitSpan'}
                      direction={sortField === 'digitSpan' ? sortDirection : 'asc'}
                      onClick={() => handleSort('digitSpan')}
                    >
                      Digit Span
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'sequenceAccuracy'}
                      direction={sortField === 'sequenceAccuracy' ? sortDirection : 'asc'}
                      onClick={() => handleSort('sequenceAccuracy')}
                    >
                      Focus (%)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'mathScore'}
                      direction={sortField === 'mathScore' ? sortDirection : 'asc'}
                      onClick={() => handleSort('mathScore')}
                    >
                      Reasoning (%)
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No test sessions found. Complete a cognitive test to see your results here.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedSessions.map((session, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{dayjs(session.timestamp).format('MMM DD, YYYY HH:mm')}</TableCell>
                      <TableCell align="right">{session.reactionTime} ms</TableCell>
                      <TableCell align="right">{session.digitSpan}</TableCell>
                      <TableCell align="right">{session.sequenceAccuracy}%</TableCell>
                      <TableCell align="right">{session.mathScore}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}
    </Stack>
  );
}
