import React from 'react';
import { AuthorityCardProps } from '@/types/authority';
import AuthorityImage from './AuthorityImage';
import AuthorityInfo from './AuthorityInfo';
import ResolutionLink from './ResolutionLink';
import AuthorityActionButton from './AuthorityActionButton';

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
      {/* Imagen */}
      <AuthorityImage 
        src={authority.image}
        alt={authority.name}
      />
      
      {/* Información en la parte inferior */}
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2">
          <AuthorityInfo 
            name={authority.name}
            title={authority.title}
          />
          
          <p className="mt-2 text-sm font-bold text-zinc-500">
            Resolución de Nombramiento:
          </p>
          
          <ResolutionLink url={authority.resolution} />
        </div>
        
        {/* Botón de acción */}
        <div className="mt-4">
          <AuthorityActionButton authority={authority} />
        </div>
      </div>
    </div>
  );
};

export default AuthorityCard;
