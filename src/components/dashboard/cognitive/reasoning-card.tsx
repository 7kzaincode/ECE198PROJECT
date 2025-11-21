'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CalculatorIcon } from '@phosphor-icons/react/dist/ssr/Calculator';

export interface ReasoningCardProps {
  value: number; // 0-100 percentage
  sx?: SxProps;
}

export function ReasoningCard({ value, sx }: ReasoningCardProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                ➗ Reasoning
              </Typography>
              <Typography variant="h4">{value}%</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CalculatorIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} spacing={2}>
            <CircularProgress
              variant="determinate"
              value={value}
              size={80}
              thickness={4}
              sx={{ color: 'var(--mui-palette-primary-main)' }}
            />
            <Typography color="text.secondary" variant="caption">
              Math Score
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

