export interface RegistrationFormData {
  role: string;
  password: string;
  lastName: string;
  firstName: string;
  schoolEmail: string;
  agreeToTerms: boolean;
  confirmPassword: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface SecurityStepProps {
  isLoading: boolean;
  showPassword: boolean;
  onPrevious: () => void;
  showConfirmPassword: boolean;
  formData: RegistrationFormData;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AuthButtonProps {
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}
