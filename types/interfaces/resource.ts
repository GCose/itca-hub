import { UserAuth } from '..';

export interface Resource {
  _id: string;
  title: string;
  category: string;
  downloads: number;
  viewCount: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  fileUrls: string[];
  isDeleted: boolean;
  updatedBy?: string;
  description: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
  __v?: number;
}

export interface Pagination {
  total: number;
  limit: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ResourcesResponse {
  status: string;
  data: {
    message: string;
    resources: Resource[];
    pagination: Pagination;
  };
}

export interface SingleResourceResponse {
  status: string;
  data: {
    message: string;
    resource: Resource;
  };
}

export interface UseResourcesProps {
  token: string;
}

export interface FetchResourcesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  category?: string;
  includeDeleted?: boolean;
  sortOrder?: 'asc' | 'desc';
  visibility?: 'all' | 'admin';
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
  department?: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
}

export interface ResourceTableProps {
  page: number;
  total: number;
  token: string;
  limit: number;
  isError?: boolean;
  isLoading: boolean;
  searchTerm: string;
  totalPages: number;
  onRefresh: () => void;
  resources: Resource[];
  allResources: Resource[];
  userRole: 'admin' | 'user';
  onClearFilters: () => void;
  mode?: 'default' | 'recycleBin';
  setPage: (page: number) => void;
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
}

export interface AdminResourcesPageProps {
  userData: UserAuth;
}

export interface StudentResourcesPageProps {
  userData: UserAuth;
}
