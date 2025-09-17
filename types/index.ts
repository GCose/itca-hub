import { JSX } from 'react';

export interface ErrorResponseData {
  message?: string;
}

export interface CustomError extends Error {
  statusCode?: number;
}

export interface UserAuth {
  role: string;
  token: string;
  userId: string;
  lastName: string | undefined;
  firstName: string | undefined;
  schoolEmail: string | undefined;
  profilePictureUrl: string | undefined;
}

export type UserProps = {
  userData: UserAuth;
};

export type NavItem = {
  name: string;
  href: string;
  icon: JSX.Element;
  children?: NavItem[];
};
export interface UseUserActionsProps {
  token: string;
  onUserUpdated: () => void;
}

export type ActionType = 'delete' | 'changeRole' | 'toggleActivation';

export interface AdminUsersPageProps {
  userData: UserAuth;
}

export interface Resource {
  type: string;
  title: string;
  fileUrl: string;
  category: string;
  fileSize: string;
  fileName: string;
  downloads: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  fileUrls: string[];
  resourceId: string;
  department: string;
  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;
  updatedBy?: string;
  description: string;
  dateUploaded: string;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
}

export interface ApiResource {
  _id: string;
  title: string;
  category: string;
  downloads: number;
  viewCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  resourceId: string;
  department: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  updatedBy?: string;
  fileUrls: string[];
  description: string;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
}

export interface CreateResourcePayload {
  title: string;
  category: string;
  fileUrls: string[];
  department: string;
  description: string;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
}

export interface UpdateResourcePayload {
  title?: string;
  category?: string;
  department?: string;
  fileUrls?: string[];
  description?: string;
  visibility?: 'all' | 'admin';
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
}

export interface ResourceFiltersProps {
  fileType: string;
  category: string;
  searchTerm: string;
  department: string;
  visibility?: string;
  fileTypes: string[];
  categories: string[];
  clearFilters?: () => void;
  setFileType: (type: string) => void;
  setSearchTerm: (term: string) => void;
  setDepartment: (dept: string) => void;
  setCategory: (category: string) => void;
  setVisibility?: (visibility: string) => void;
}

export interface ItcaApiResponse<T = unknown> {
  status: string;
  data: T;
  message?: string;
}

export interface ResourcesResponse {
  status: string;
  data: any;
  pagination: {
    limit: number;
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  resources: ApiResource[];
}

export interface JeetixResponse {
  status: string;
  data: {
    fileUrl: string;
    fileName: string;
  };
}

export interface JeetixListResponse {
  status: string;
  data: Array<{
    url: string;
    name: string;
    metadata: {
      size: string;
      mediaLink: string;
      contentType: string;
      timeCreated: string;
      [key: string]: unknown;
    };
  }>;
}

export interface JeetixFileInfo {
  status: string;
  data: {
    fileUrl: string;
    metadata: {
      size: string;
      mediaLink: string;
      contentType: string;
      timeCreated: string;
      [key: string]: unknown;
    };
  };
}

export interface JeetixFileItem {
  url: string;
  name: string;
  metadata: {
    size: string;
    mediaLink: string;
    contentType: string;
    timeCreated: string;
    [key: string]: unknown;
  };
}

export interface ResourcesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  fileType?: string;
  visibility?: string;
  department?: string;
  includeDeleted?: boolean;
}

export interface UseResourceViewerProps {
  token: string;
  resourceId?: string;
}

export interface ResourceTableProps {
  token: string;
  isError?: boolean;
  searchTerm: string;
  isLoading: boolean;
  resources: Resource[];
  onRefresh: () => void;
  allResources: Resource[];
  onClearFilters: () => void;
  userRole: 'admin' | 'user';
  mode?: 'default' | 'recycleBin';
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
}
