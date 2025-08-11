import React from 'react';
import { AuthorityGridProps } from '@/types/authority';
import AuthorityCard from './AuthorityCard';

const AuthorityGrid: React.FC<AuthorityGridProps> = ({ authorities }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-[10%]">
      {authorities.map((authority) => (
        <AuthorityCard 
          key={authority.id} 
          authority={authority} 
        />
      ))}
    </div>
  );
};

export default AuthorityGrid;
