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
