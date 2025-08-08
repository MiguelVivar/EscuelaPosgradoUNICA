import React from 'react';
import { DirectoryTableProps } from '@/types/contact';

export default function DirectoryTable({ section }: DirectoryTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 mt-4 lg:mt-0">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        {section.name}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                Dependencia
              </th>
              <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                Correo
              </th>
              <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                Mesa de Partes
              </th>
              <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                Teléfono
              </th>
            </tr>
          </thead>
          <tbody>
            {section.entries.map((entry, index) => (
              <tr key={index}>
                <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                  {entry.dependencia}
                </td>
                <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                  {entry.correo}
                </td>
                <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                  {entry.mesaPartes}
                </td>
                <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  {entry.telefono}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
