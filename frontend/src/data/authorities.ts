import { Authority } from '@/types/authority';
import directorPosgrado from '@/assets/director_posgrado.jpg';

export const authoritiesData: Authority[] = [
  {
    id: 'director',
    name: 'Dr. Mario Gustavo REYES MEJÍA',
    title: 'Director General',
    description: 'Encargado de la dirección general de la universidad.',
    image: directorPosgrado,
    resolution: 'https://www.unica.edu.pe/transparencia/buscador/sistema/upload/archivos/2024/11/27/RR-441-2024.pdf',
    externalLink: 'https://ctivitae.concytec.gob.pe/appDirectorioCTI/VerDatosInvestigador.do?id_investigador=99063',
  },
  {
    id: 'vice-director',
    name: 'Dra. Ana Gómez',
    title: 'Vice-Directora Académica',
    description: 'Responsable de la gestión académica.',
    image: '/vice-director.jpg',
    resolution: 'https://www.ejemplo.com/resolucion-vice-director',
    externalLink: 'https://www.ejemplo.com/jurado-2',
  },
  {
    id: 'jurado-1',
    name: 'Dr. Roberto Martínez',
    title: 'Presidente del Jurado',
    description: 'Encargado de dirigir el comité de evaluación.',
    image: '/jurado-1.jpg',
    resolution: 'https://www.ejemplo.com/resolucion-jurado-1',
    externalLink: 'https://www.ejemplo.com/jurado-2',
  },
  {
    id: 'jurado-2',
    name: 'Dra. Laura Fernández',
    title: 'Miembro del Jurado',
    description: 'Responsable de evaluar proyectos académicos.',
    image: '/jurado-2.jpg',
    resolution: 'https://www.ejemplo.com/resolucion-jurado-2',
    externalLink: 'https://www.ejemplo.com/jurado-2',
  },
  {
    id: 'jurado-3',
    name: 'Dr. Miguel Sánchez',
    title: 'Miembro del Jurado',
    description: 'Apoya la supervisión y evaluación académica.',
    image: '/jurado-3.jpg',
    resolution: 'https://www.ejemplo.com/resolucion-jurado-3',
    externalLink: 'https://www.ejemplo.com/jurado-2',
  },
  {
    id: 'jurado-4',
    name: 'Dra. Sofía López',
    title: 'Miembro del Jurado',
    description: 'Especialista en investigación y evaluación.',
    image: '/jurado-4.jpg',
    resolution: 'https://www.ejemplo.com/resolucion-jurado-4',
  },
];

export default authoritiesData;
