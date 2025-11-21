'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import { BrainIcon } from '@phosphor-icons/react/dist/ssr/Brain';
import { NoSsr } from '@/components/core/no-ssr';

export interface LogoProps {
  color?: 'dark' | 'light';
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', height = 32, width }: LogoProps): React.JSX.Element {
  const textColor = color === 'light' ? 'var(--mui-palette-common-white)' : 'var(--mui-palette-text-primary)';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <BrainIcon 
        size={height} 
        weight="fill" 
        color={textColor}
      />
      <Typography
        variant="h6"
        component="span"
        sx={{
          color: textColor,
          fontWeight: 600,
          fontSize: `${height * 0.6}px`,
          lineHeight: 1,
        }}
      >
        Cognitive Dashboard
      </Typography>
    </Box>
  );
}

export interface DynamicLogoProps {
  colorDark?: 'dark' | 'light';
  colorLight?: 'dark' | 'light';
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'dark',
  colorLight = 'light',
  height = 32,
  width,
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;
  
  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: '200px' }} />}>
      <Logo color={color} height={height} width={width} />
    </NoSsr>
  );
}
