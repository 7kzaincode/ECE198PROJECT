'use client';

import * as React from 'react';
import { PatientAvatar } from '@/components/core/patient-avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import { getPatientName } from '@/data/patients';
import { paths } from '@/paths';

// TODO: Replace with real patient data from Firebase Auth

export function AccountInfo(): React.JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const patientId = user?.id || 'patient001';
  const patientName = user ? `${user.firstName} ${user.lastName}`.trim() || getPatientName(patientId) : getPatientName(patientId);
  
  const handleLogout = async (): Promise<void> => {
    await authClient.signOut();
    // Force a hard navigation to clear all state
    window.location.href = paths.selectPatient;
  };
  
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <PatientAvatar patientId={patientId} size={80} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{patientName}</Typography>
            <Typography color="text.secondary" variant="body2">
              Patient ID: {patientId}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Room: {patientId === 'patient001' ? '204' : patientId === 'patient002' ? '205' : patientId === 'patient003' ? '206' : '207'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Admitted: 2025-10-15
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </CardActions>
    </Card>
  );
}
