export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return strength;
};

export const getPasswordStrengthText = (strength: number): string => {
  if (strength === 0) return "";
  if (strength === 1) return "Weak";
  if (strength === 2) return "Fair";
  if (strength === 3) return "Good";
  return "Strong";
};

export const getPasswordStrengthColor = (strength: number): string => {
  if (strength === 0) return "bg-gray-200";
  if (strength === 1) return "bg-red-500";
  if (strength === 2) return "bg-yellow-500";
  if (strength === 3) return "bg-blue-500";
  return "bg-green-500";
};
