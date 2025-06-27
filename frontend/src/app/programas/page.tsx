"use client";

import Image from "next/image";
import Fadministracion from "@/assets/Fadministracion.png";
import portada01 from "@/assets/portada01.jpg";
import portada02 from "@/assets/portada02.jpeg";
import portada03 from "@/assets/portada03.jpeg";
import Fenfermeria from "@/assets/Fenfermeria.jpeg";
import bg from "@/assets/bg.jpg";

// Datos de los doctorados
const doctorados = [
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
const maestrias = [
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

export default function ProgramasPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image 
            src={bg.src}
            alt="Universidad Nacional San Luis Gonzaga de Ica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Programas Académicos</h1>
        </div>
      </section>

      {/* Doctorados Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px bg-amber-500 w-12"></div>
            <span className="text-amber-600 font-medium text-lg">EPG - UNICA</span>
            <div className="h-px bg-amber-500 w-12"></div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Doctorados</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {doctorados.slice(0, 3).map((doctorado) => (
            <div key={doctorado.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-300 relative">
                <Image 
                  src={doctorado.imagen.src} 
                  alt={doctorado.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    Ver más
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  {doctorado.titulo}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Segunda fila de doctorados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {doctorados.slice(3, 5).map((doctorado) => (
            <div key={doctorado.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-300 relative">
                <Image 
                  src={doctorado.imagen.src}
                  alt={doctorado.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    Ver más
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  {doctorado.titulo}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Maestrías Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="h-px bg-amber-500 w-12"></div>
              <span className="text-amber-600 font-medium text-lg">EPG - UNICA</span>
              <div className="h-px bg-amber-500 w-12"></div>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Maestrías</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {maestrias.map((categoria, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{categoria.categoria}</h3>
                {categoria.programas.map((programa, programaIndex) => (
                  <div key={programaIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{programa.nombre}</p>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded font-medium transition-colors">
                      {programa.estado}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}