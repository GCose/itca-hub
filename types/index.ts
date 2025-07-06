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
  visibility: string;
  setVisibility: (visibility: string) => void;
  fileTypes: string[];
  categories: string[];
  clearFilters?: () => void;
}
