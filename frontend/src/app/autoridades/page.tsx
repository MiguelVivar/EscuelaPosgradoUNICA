'use client';

import Link from 'next/link';

const authorities = [
  {
    id: 'director',
    name: 'Dr. Mario Gustavo REYES MEJÍA',
    title: 'Director General',
    description: 'Encargado de la dirección general de la universidad.',
    image: '/director_posgrado.jpg',
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

const AuthoritiesPage = () => {
  return (
    <main className="p-8 bg-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold text-red-700 text-center mt-[5%]">
        Autoridades y Jurados
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-[10%] mt-8">
        {authorities.map((authority) => (
          <div
            key={authority.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
          >
            {/* Imagen que ocupa toda la parte superior */}
            <div className="w-full h-64">
              <img
                src={authority.image}
                alt={authority.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Información en la parte inferior */}
            <div className="p-4 flex flex-col justify-between h-full">
              <h2 className="text-lg font-semibold text-zinc-800">{authority.name}</h2>
              <p className="text-zinc-600">{authority.title}</p>
              <p className="mt-2 text-sm font-bold text-zinc-500">Resolución de Nombramiento:</p>
              <a href={authority.resolution}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver Resolución
              </a>
              {authority.externalLink ? (
                <a
                  href={authority.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                >
                  Ver Más
                </a>
              ) : (
                <Link href={`/autoridades/${authority.id}`}>
                  <div className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">
                    Ver Más
                  </div>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AuthoritiesPage;
