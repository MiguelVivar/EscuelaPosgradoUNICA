import { CampusModule } from "@/types";
import admision from "@/assets/intranet.png";
import aulaVirtual from "@/assets/aulavirtual.png";
import caja from "@/assets/caja.png";
import docentes from "@/assets/docentes.png";
import gradosTitulos from "@/assets/grado-titulos.png";
import intranet from "@/assets/intranet.png";
import matricula from "@/assets/matricula.png";
import tramites from "@/assets/tramites.png";

export const CAMPUS_MODULES: CampusModule[] = [
  {
    id: "intranet",
    title: "INTRANET",
    href: "/campus-virtual/intranet",
    icon: intranet,
    alt: "Intranet",
  },
  {
    id: "matricula",
    title: "MATRÍCULA",
    href: "/campus-virtual/matricula",
    icon: matricula,
    alt: "Matricula",
  },
  {
    id: "admision",
    title: "ADMISIÓN",
    href: "/campus-virtual/admision",
    icon: admision,
    alt: "Admision",
  },
  {
    id: "docentes",
    title: "GESTIÓN DE DOCENTES",
    href: "/campus-virtual/docentes",
    icon: docentes,
    alt: "Docentes",
    isMultiLine: true,
  },
  {
    id: "aula-virtual",
    title: "AULA VIRTUAL",
    href: "/campus-virtual/aula-virtual",
    icon: aulaVirtual,
    alt: "Aula virtual",
    isMultiLine: true,
  },
  {
    id: "caja",
    title: "CAJA",
    href: "/campus-virtual/caja",
    icon: caja,
    alt: "Caja",
  },
  {
    id: "tramites",
    title: "TRÁMITES",
    href: "/campus-virtual/tramites",
    icon: tramites,
    alt: "tramites",
  },
  {
    id: "grado-titulos",
    title: "GRADO Y TÍTULOS",
    href: "/campus-virtual/grado-titulos",
    icon: gradosTitulos,
    alt: "Grado y Títulos",
    isMultiLine: true,
  },
];
