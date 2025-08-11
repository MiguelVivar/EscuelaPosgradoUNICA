export interface PasswordResetFormData {
  password: string;
  confirmPassword: string;
}

export interface PasswordResetState {
  isValidToken: boolean | null;
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  success: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export interface UsePasswordResetReturn extends PasswordResetState {
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  message: string;
}

export interface PasswordInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}
