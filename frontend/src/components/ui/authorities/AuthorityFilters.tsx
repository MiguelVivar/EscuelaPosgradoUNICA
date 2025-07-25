import React from 'react';

interface AuthorityFiltersProps {
  onFilter?: (filterType: string) => void;
  currentFilter?: string;
}

const AuthorityFilters: React.FC<AuthorityFiltersProps> = ({ 
  onFilter, 
  currentFilter = 'all' 
}) => {
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'director', label: 'Directores' },
    { key: 'jurado', label: 'Jurados' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilter?.(filter.key)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentFilter === filter.key
              ? 'bg-amber-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default AuthorityFilters;
