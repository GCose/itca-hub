import { LucideIcon } from 'lucide-react';

export interface NetworkErrorProps {
  title?: string;
  onRetry: () => void;
  description?: string;
  retryButtonText?: string;
}

export interface EmptyStateProps {
  title?: string;
  uploadUrl: string;
  itemName?: string;
  description?: string;
  onRefresh?: () => void;
  uploadIcon?: LucideIcon;
  uploadButtonText?: string;
  showRefreshButton?: boolean;
}
