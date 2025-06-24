import { CarouselSlide } from "../types";

const defaultSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Bienvenido a la Escuela de Posgrado",
    subtitle: "Excelencia Académica",
    description:
      "Programas de maestría y doctorado de la más alta calidad académica",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Conoce Más",
    buttonLink: "/programas",
  },
  {
    id: 2,
    title: "Autoridades y Gestión",
    subtitle: "Liderazgo Institucional",
    description:
      "Conoce a nuestros líderes y la estructura de gestión de la Escuela de Posgrado",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Ver Autoridades",
    buttonLink: "/autoridades",
  },
  {
    id: 3,
    title: "Campus Virtual",
    subtitle: "Educación Digital",
    description:
      "Accede a nuestras plataformas digitales y recursos académicos",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Ingresar",
    buttonLink: "/campus-virtual",
  },
  {
    id: 4,
    title: "Resultados de Admisión",
    subtitle: "Tu Futuro Comienza Aquí",
    description: "Consulta los resultados del proceso de admisión 2025",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Ver Resultados",
    buttonLink: "https://drive.google.com/file/u/2/d/1bKewdaBGJL3HNw0Nhv9aC5qCEymdtEzq/view?usp=sharing",
    target: "_blank",
  },
];

export default defaultSlides;
