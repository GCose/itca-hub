export interface Resource {
  title: string;
  category: string;
  downloads: number;
  viewCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  fileUrls: string[];
  resourceId: string;
  isDeleted: boolean;
  updatedBy?: string;
  description: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
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
