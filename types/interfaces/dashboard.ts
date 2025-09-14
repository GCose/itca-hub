import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  token?: string;
}

export interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  token?: string;
}

export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  showPulse?: boolean;
  actions?: ReactNode;
  titleColors?: {
    primary: string;
    secondary: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalResources: number;
  activeUsers: number;
}

export interface DashboardStatsCardProps {
  title: string;
  icon: ReactNode;
  isLoading?: boolean;
  value: string | number;
  valueClassName?: string;
}
