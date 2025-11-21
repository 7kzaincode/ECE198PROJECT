'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { BrainIcon } from '@phosphor-icons/react/dist/ssr/Brain';

export interface MemoryCardProps {
  value: number; // digit span
  diff?: number; // percentage change
  trend?: 'up' | 'down'; // up = better, down = worse
  sx?: SxProps;
}

export function MemoryCard({ value, diff, trend, sx }: MemoryCardProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                🧠 Memory
              </Typography>
              <Typography variant="h4">{value} digits</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <BrainIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          {diff !== undefined && trend ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {Math.abs(diff)}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                {trend === 'up' ? 'Improved' : 'Declined'} since last test
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

