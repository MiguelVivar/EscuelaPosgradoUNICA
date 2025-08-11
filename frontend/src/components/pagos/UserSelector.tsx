'use client';

import { useState, useEffect } from 'react';
import { UsuarioResponse } from '@/types/auth';
import { API_CONFIG, getAuthHeaders } from '@/lib/api';

interface UserSelectorProps {
  selectedUserId: number | null;
  onUserSelect: (userId: number | null) => void;
  placeholder?: string;
  className?: string;
}

export default function UserSelector({ 
  selectedUserId, 
  onUserSelect, 
  placeholder = "Seleccionar usuario",
  className = ""
}: UserSelectorProps) {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/rol/ALUMNO`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    `${usuario.nombres} ${usuario.apellidos} ${usuario.email} ${usuario.codigoEstudiante || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedUser = usuarios.find(u => u.id === selectedUserId);

  return (
    <div className={`relative ${className}`}>
      {/* Campo de búsqueda/selección */}
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedUser ? `${selectedUser.nombres} ${selectedUser.apellidos}` : '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Botón para limpiar selección */}
        {selectedUserId && (
          <button
            onClick={() => {
              onUserSelect(null);
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        
        {/* Indicador de dropdown */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          ▼
        </button>
      </div>

      {/* Lista desplegable */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">
              Cargando usuarios...
            </div>
          ) : (
            <>
              {/* Opción "Todos" */}
              <button
                onClick={() => {
                  onUserSelect(null);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                className="w-full p-3 text-left hover:bg-gray-100 border-b"
              >
                <div className="font-medium">Todos los usuarios</div>
                <div className="text-sm text-gray-500">Ver todos</div>
              </button>

              {/* Lista de usuarios filtrados */}
              {filteredUsuarios.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  No se encontraron usuarios
                </div>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <button
                    key={usuario.id}
                    onClick={() => {
                      onUserSelect(usuario.id);
                      setSearchTerm('');
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-100 ${
                      selectedUserId === usuario.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">
                      {usuario.nombres} {usuario.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">
                      {usuario.email}
                      {usuario.codigoEstudiante && ` • ${usuario.codigoEstudiante}`}
                    </div>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
}
