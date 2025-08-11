import Fadministracion from "@/assets/Fadministracion.png";
import portada01 from "@/assets/portada01.jpg";
import portada02 from "@/assets/portada02.jpeg";
import portada03 from "@/assets/portada03.jpeg";
import Fenfermeria from "@/assets/Fenfermeria.jpeg";
import { Doctorado, CategoriaAcademica } from "@/types";

// Datos de los doctorados
export const doctorados: Doctorado[] = [
  {
    id: 1,
    titulo: "Ciencias Empresariales",
    imagen: Fadministracion,
    descripcion: "Programa de doctorado en ciencias empresariales"
  },
  {
    id: 2,
    titulo: "Derecho y Ciencia Política",
    imagen: portada01,
    descripcion: "Programa de doctorado en derecho y ciencia política"
  },
  {
    id: 3,
    titulo: "Educación",
    imagen: portada02,
    descripcion: "Programa de doctorado en educación"
  },
  {
    id: 4,
    titulo: "Gestión Ambiental",
    imagen: portada03,
    descripcion: "Programa de doctorado en gestión ambiental"
  },
  {
    id: 5,
    titulo: "Salud Pública",
    imagen: Fenfermeria,
    descripcion: "Programa de doctorado en salud pública"
  }
];

// Datos de las maestrías organizadas por categorías
export const maestrias: CategoriaAcademica[] = [
  {
    categoria: "Administración",
    programas: [
      { nombre: "Gestión empresarial", estado: "Más información" },
      { nombre: "Gestión pública", estado: "Más información" }
    ]
  },
  {
    categoria: "Agronomía",
    programas: [
      { nombre: "Agronegocios", estado: "Más información" },
      { nombre: "Producción agrícola", estado: "Más información" }
    ]
  },
  {
    categoria: "Ciencias de la Comunicación",
    programas: [
      { nombre: "Comunicación para el desarrollo", estado: "Más información" }
    ]
  },
  {
    categoria: "Ciencias de los Alimentos",
    programas: [
      { nombre: "Tecnologías de los alimentos", estado: "Más información" }
    ]
  },
  {
    categoria: "Ciencias del Mar",
    programas: [
      { nombre: "Acuicultura", estado: "Más información" }
    ]
  },
  {
    categoria: "Ciencias Veterinarias",
    programas: [
      { nombre: "Sanidad, producción animal y medio ambiente", estado: "Más información" }
    ]
  },
  {
    categoria: "Contabilidad",
    programas: [
      { nombre: "Política y administración tributaria", estado: "Más información" }
    ]
  },
  {
    categoria: "Derecho",
    programas: [
      { nombre: "Civil y comercial", estado: "Más información" },
      { nombre: "Ciencias penales", estado: "Más información" }
    ]
  },
  {
    categoria: "Economía",
    programas: [
      { nombre: "Finanzas", estado: "Más información" }
    ]
  },
  {
    categoria: "Educación",
    programas: [
      { nombre: "Administración y planificación de la educación superior", estado: "Más información" },
      { nombre: "Gestión educativa", estado: "Más información" }
    ]
  },
  {
    categoria: "Enfermería",
    programas: [
      { nombre: "Ciencias de la enfermería", estado: "Más información" }
    ]
  },
  {
    categoria: "Ingeniería Civil",
    programas: [
      { nombre: "Ingeniería en la gestión del riesgo de desastre", estado: "Más información" },
      { nombre: "Gestión y gerencia de la construcción", estado: "Más información" }
    ]
  },
  {
    categoria: "Ingeniería de Minas y Metalurgia",
    programas: [
      { nombre: "Gestión integrada del medio ambiente, seguridad, salud ocupacional y calidad en minería", estado: "Más información" }
    ]
  },
  {
    categoria: "Ingeniería de Sistemas",
    programas: [
      { nombre: "Gestión de la tecnología de la información", estado: "Más información" }
    ]
  },
  {
    categoria: "Ingeniería Mecánica y Eléctrica",
    programas: [
      { nombre: "Energía y medio ambiente", estado: "Más información" },
      { nombre: "Ingeniería de mantenimiento", estado: "Más información" }
    ]
  },
  {
    categoria: "Ingeniería Química",
    programas: [
      { nombre: "Procesos químicos y ambientales", estado: "Más información" }
    ]
  },
  {
    categoria: "Odontología",
    programas: [
      { nombre: "Odontología", estado: "Más información" }
    ]
  },
  {
    categoria: "Salud Pública",
    programas: [
      { nombre: "Salud Pública", estado: "Más información" }
    ]
  }
];
