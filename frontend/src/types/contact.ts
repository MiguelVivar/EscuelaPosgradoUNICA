export interface ContactInfo {
  label: string;
  value: string;
  type?: 'text' | 'email' | 'phone' | 'address';
}

export interface DirectoryEntry {
  dependencia: string;
  correo: string;
  mesaPartes: string;
  telefono: string;
}

export interface DirectorySection {
  name: string;
  entries: DirectoryEntry[];
}

export interface ContactFormData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export interface ContactFormProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submitStatus: {
    type: 'success' | 'error' | null;
    message: string;
  };
  onReset: () => void;
}

export interface ContactInfoCardProps {
  contactInfo: ContactInfo[];
}

export interface DirectoryTableProps {
  section: DirectorySection;
}

export interface DirectoryMenuProps {
  menuItems: string[];
  selectedItem: string;
  onSelectItem: (item: string) => void;
}

export interface MapProps {
  title?: string;
  embedUrl: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}
