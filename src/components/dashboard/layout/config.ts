import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'progress', title: 'Progress', href: paths.dashboard.progress, icon: 'trend-up' },
  { key: 'data-overview', title: 'Data Overview', href: paths.dashboard.dataOverview, icon: 'table' },
  { key: 'account', title: 'Profile', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
