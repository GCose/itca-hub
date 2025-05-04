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
  token: string;
  role: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  dateUploaded: string;
  fileSize: string;
  downloads: number;
  viewCount: number;
  fileUrl: string;
  fileName: string;
  visibility: 'all' | 'admin';
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
  department?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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
