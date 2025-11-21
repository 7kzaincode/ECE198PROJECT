'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import RouterLink from 'next/link';
import { ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { authClient } from '@/lib/auth/client';
import { paths } from '@/paths';

import { MobileNav } from './mobile-nav';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.dashboard.account}
              variant="outlined"
              size="small"
            >
              Profile
            </Button>
            <Button
              onClick={async () => {
                await authClient.signOut();
                window.location.href = paths.selectPatient;
              }}
              variant="outlined"
              color="error"
              size="small"
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </Box>
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
