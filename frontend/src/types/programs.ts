import { StaticImageData } from "next/image";

export interface Doctorado {
  id: number;
  titulo: string;
  imagen: StaticImageData;
  descripcion: string;
}

export interface Programa {
  nombre: string;
  estado: string;
}

export interface CategoriaAcademica {
  categoria: string;
  programas: Programa[];
}

export interface HeroSectionProps {
  title: string;
  backgroundImage: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export interface DoctoradoCardProps {
  doctorado: Doctorado;
  onVerMas?: (id: number) => void;
}

export interface DoctoradosGridProps {
  doctorados: Doctorado[];
  onVerMas?: (id: number) => void;
}

export interface ProgramaItemProps {
  programa: Programa;
  onMasInformacion?: (nombre: string) => void;
}

export interface MaestriaCategoriaProps {
  categoria: CategoriaAcademica;
  onMasInformacion?: (nombre: string) => void;
}

export interface MaestriasGridProps {
  maestrias: CategoriaAcademica[];
  onMasInformacion?: (nombre: string) => void;
}
