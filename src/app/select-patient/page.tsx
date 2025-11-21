'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PatientAvatar } from '@/components/core/patient-avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { authClient } from '@/lib/auth/client';
import { patients } from '@/data/patients';
import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';

export default function SelectPatientPage(): React.JSX.Element {
  const router = useRouter();
  const { user, checkSession } = useUser();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      router.replace(paths.dashboard.overview);
    }
  }, [user, router]);

  const handleSelectPatient = async (patientId: string): Promise<void> => {
    setIsLoading(patientId);
    try {
      // Sign in as the selected patient
      const result = await authClient.selectPatient({ patientId });
      
      if (result.error) {
        console.error('Error selecting patient:', result.error);
        setIsLoading(null);
        return;
      }

      // Refresh the user context to get the new patient
      if (checkSession) {
        await checkSession();
      }

      // Use window.location for a hard navigation to ensure everything refreshes
      window.location.href = paths.dashboard.overview;
    } catch (error) {
      console.error('Error selecting patient:', error);
      setIsLoading(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'var(--mui-palette-background-default)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Stack spacing={2}>
            <Typography variant="h3" component="h1">
              Choose Who You Are
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select your patient profile to view your cognitive test results
            </Typography>
          </Stack>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {patients.map((patient) => (
              <Grid key={patient.id} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleSelectPatient(patient.id)}
                >
                  <CardContent>
                    <Stack spacing={2} sx={{ alignItems: 'center', py: 2 }}>
                      <PatientAvatar patientId={patient.id} size={80} />
                      <Typography variant="h5" component="h2">
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.id}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={isLoading === patient.id}
                        sx={{ mt: 2 }}
                      >
                        {isLoading === patient.id ? 'Loading...' : 'Select'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

