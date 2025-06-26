export interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export interface LoginFormSectionProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  showPassword: boolean;
  emailError: string;
  loginError?: string;
  successMessage?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
}

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

export interface SubmitButtonProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}