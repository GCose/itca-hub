export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  schoolEmail: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  role: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ErrorResponseData {
  message?: string;
}

export interface CustomError extends Error {
  statusCode?: number;
}

export interface UserAuth {
  firstName: string | undefined;
  lastName: string | undefined;
  schoolEmail: string | undefined;
  profilePictureUrl: string | undefined;
  userId: unknown;
  token: string;
  role: string;
}

export interface Resource {
  resourceId: string;
  title: string;
  description: string;
  category: string;
  downloads: number;
  viewCount: number;
  fileUrls: string[];
  fileUrl: string;
  fileName: string;
  type: string;
  fileSize: string;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  dateUploaded: string;
}

export interface ApiResource {
  _id: string;
  resourceId: string;
  title: string;
  description: string;
  category: string;
  downloads: number;
  viewCount: number;
  fileUrls: string[];
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourcePayload {
  title: string;
  description: string;
  category: string;
  fileUrls: string[];
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: string;
}

export interface UpdateResourcePayload {
  title?: string;
  description?: string;
  category?: string;
  fileUrls?: string[];
  visibility?: 'all' | 'admin';
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
  department?: string;
}

export interface ResourceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  department: string;
  setDepartment: (dept: string) => void;
  fileType: string;
  setFileType: (type: string) => void;
  category: string;
  setCategory: (category: string) => void;
  visibility?: string;
  setVisibility?: (visibility: string) => void;
  fileTypes: string[];
  categories: string[];
  clearFilters?: () => void;
}

export interface ItcaApiResponse<T = unknown> {
  status: string;
  data: T;
  message?: string;
}

export interface ResourcesResponse {
  resources: ApiResource[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface JeetixResponse {
  status: string;
  data: {
    fileName: string;
    fileUrl: string;
  };
}

export interface JeetixListResponse {
  status: string;
  data: Array<{
    name: string;
    url: string;
    metadata: {
      size: string;
      contentType: string;
      timeCreated: string;
      mediaLink: string;
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
      contentType: string;
      timeCreated: string;
      mediaLink: string;
      [key: string]: unknown;
    };
  };
}

export interface JeetixFileItem {
  name: string;
  url: string;
  metadata: {
    size: string;
    contentType: string;
    timeCreated: string;
    mediaLink: string;
    [key: string]: unknown;
  };
}

export interface ResourcesParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  category?: string;
  fileType?: string;
  visibility?: string;
  includeDeleted?: boolean;
}

export interface UseResourceViewerProps {
  resourceId?: string;
  token: string;
}

export interface ResourceTableProps {
  resources: Resource[];
  allResources: Resource[];
  isLoading: boolean;
  isError?: boolean;
  token: string;
  searchTerm: string;
  userRole: 'admin' | 'user';
  mode?: 'default' | 'recycleBin';
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationRequired: boolean;
  imageUrl?: string;
}
