import { FormData } from "@/types/sign-up";

export const validatePersonalInfo = (
  formData: FormData
): { isValid: boolean; error: string } => {
  if (!formData.firstName || !formData.lastName || !formData.email) {
    return {
      isValid: false,
      error: "Please fill in all fields",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  // Check for UTG email domain
  if (!formData.email.endsWith("@utg.edu.gm")) {
    return {
      isValid: false,
      error: "Please use your University of The Gambia email (@utg.edu.gm)",
    };
  }

  return {
    isValid: true,
    error: "",
  };
};

export const validateSecurity = (
  formData: FormData
): { isValid: boolean; error: string } => {
  if (!formData.password || !formData.confirmPassword) {
    return {
      isValid: false,
      error: "Please fill in all fields",
    };
  }

  if (formData.password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (formData.password !== formData.confirmPassword) {
    return {
      isValid: false,
      error: "Passwords do not match",
    };
  }

  if (!formData.agreeToTerms) {
    return {
      isValid: false,
      error: "You must agree to the terms and conditions",
    };
  }

  return {
    isValid: true,
    error: "",
  };
};
