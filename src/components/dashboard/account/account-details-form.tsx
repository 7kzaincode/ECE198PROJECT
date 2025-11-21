'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export function AccountDetailsForm(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="Update your patient information" title="Patient Details" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth required>
                <InputLabel>Patient ID</InputLabel>
                <OutlinedInput defaultValue="patient001" label="Patient ID" name="patientId" disabled />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Room Number</InputLabel>
                <OutlinedInput defaultValue="204" label="Room Number" name="room" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput label="Email address" name="email" type="email" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Emergency Contact</InputLabel>
                <OutlinedInput label="Emergency Contact" name="emergencyContact" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Emergency Phone</InputLabel>
                <OutlinedInput label="Emergency Phone" name="emergencyPhone" type="tel" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}
