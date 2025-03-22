export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// DTO for the backend API
export interface RegisterUserDTO {
  schoolEmail: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role?: string;
}

export interface FormErrors {
  [key: string]: string;
}
