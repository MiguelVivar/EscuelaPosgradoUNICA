export interface PasswordRecoveryFormData {
  email: string;
}

export interface PasswordRecoveryState {
  enviado: boolean;
  email: string;
  error: string;
  isLoading: boolean;
}

export interface UsePasswordRecoveryReturn extends PasswordRecoveryState {
  setEmail: (email: string) => void;
  setError: (error: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export interface EmailValidationOptions {
  required?: boolean;
  domainWhitelist?: string[];
  minLength?: number;
  maxLength?: number;
}

export interface PasswordRecoveryResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}
