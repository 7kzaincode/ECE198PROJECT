'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

export interface PatientAvatarProps {
  patientId?: string;
  size?: number;
  sx?: object;
}

/**
 * Creates a simple geometric avatar based on patient ID
 * Uses different shapes and colors for each patient
 */
export function PatientAvatar({ patientId = 'patient001', size = 40, sx }: PatientAvatarProps): React.JSX.Element {
  // Generate consistent color and shape based on patient ID
  const getPatientStyle = (id: string) => {
    const num = parseInt(id.replace('patient', '')) || 1;
    const colors = [
      'var(--mui-palette-primary-main)',      // patient001 - teal
      'var(--mui-palette-info-main)',        // patient002 - blue
      'var(--mui-palette-success-main)',      // patient003 - green
      'var(--mui-palette-warning-main)',      // patient004 - orange
    ];
    const shapes = ['circle', 'square', 'rounded', 'circle'];
    
    return {
      color: colors[(num - 1) % colors.length],
      shape: shapes[(num - 1) % shapes.length],
    };
  };

  const style = getPatientStyle(patientId);
  const borderRadius = style.shape === 'circle' ? '50%' : style.shape === 'rounded' ? '20%' : '0%';

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: style.color,
        borderRadius,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: size * 0.6,
          height: size * 0.6,
          bgcolor: 'var(--mui-palette-common-white)',
          borderRadius: style.shape === 'circle' ? '50%' : '20%',
          opacity: 0.8,
        }}
      />
    </Avatar>
  );
}

