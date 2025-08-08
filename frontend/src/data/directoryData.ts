import { DirectorySection } from '@/types/contact';

export const directoryData: Record<string, DirectorySection> = {
  "Alta Dirección": {
    name: "Alta Dirección",
    entries: [
      {
        dependencia: "Rector",
        correo: "rector@unica.edu.pe",
        mesaPartes: "mesadepartes@unica.edu.pe",
        telefono: "056-217405"
      },
      {
        dependencia: "Vicerrectorado Académico",
        correo: "vracademico@unica.edu.pe",
        mesaPartes: "vracademico.mesadepartes@unica.edu.pe",
        telefono: "056-218310"
      },
      {
        dependencia: "Vicerrectorado de Investigación",
        correo: "vrid@unica.edu.pe",
        mesaPartes: "vrid.mesadepartes@unica.edu.pe",
        telefono: "056-284401"
      }
    ]
  },
  "Facultades": {
    name: "Facultades",
    entries: [
      {
        dependencia: "Administración",
        correo: "administracion@unica.edu.pe",
        mesaPartes: "administracion.mesadepartes@unica.edu.pe",
        telefono: "056-287180"
      },
      {
        dependencia: "Medicina Humana",
        correo: "medicina@unica.edu.pe",
        mesaPartes: "fmh.mesadepartes@unica.edu.pe",
        telefono: "056-407126"
      },
      {
        dependencia: "Escuela de Posgrado",
        correo: "posgrado@unica.edu.pe",
        mesaPartes: "posgrado.mesadepartes@unica.edu.pe",
        telefono: "056-284400"
      }
    ]
  },
  "Direcciones y Oficinas": {
    name: "Direcciones y Oficinas",
    entries: [
      {
        dependencia: "Dirección General de Administración",
        correo: "diga@unica.edu.pe",
        mesaPartes: "diga.mesadepartes@unica.edu.pe",
        telefono: "056-283915"
      },
      {
        dependencia: "Oficina de Asesoría Jurídica",
        correo: "asesorialegal@unica.edu.pe",
        mesaPartes: "asesorialegal.mesadepartes@unica.edu.pe",
        telefono: "056-218306"
      }
    ]
  },
  "Centros y Servicios": {
    name: "Centros y Servicios",
    entries: [
      {
        dependencia: "Centro de Idiomas",
        correo: "centrodeidiomas@unica.edu.pe",
        mesaPartes: "centrodeidiomas.mesadepartes@unica.edu.pe",
        telefono: "056-284404"
      },
      {
        dependencia: "Centro Médico Universitario",
        correo: "centromedico@unica.edu.pe",
        mesaPartes: "centromedico.mesadepartes@unica.edu.pe",
        telefono: "056-284033"
      }
    ]
  }
};
