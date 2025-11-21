'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AccountInfo } from '@/components/dashboard/account/account-info';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Patient Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage your account information
        </Typography>
      </div>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 4,
            md: 6,
            xs: 12,
          }}
        >
          <AccountInfo />
        </Grid>
        <Grid
          size={{
            lg: 8,
            md: 6,
            xs: 12,
          }}
        >
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
