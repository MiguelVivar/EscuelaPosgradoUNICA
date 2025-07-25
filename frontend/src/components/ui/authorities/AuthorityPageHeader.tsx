import React from 'react';
import { AuthorityPageHeaderProps } from '@/types/authority';

const AuthorityPageHeader: React.FC<AuthorityPageHeaderProps> = ({ 
  title, 
  subtitle = "Conoce a las autoridades y jurados de la institución"
}) => {
  return (
    <div className="text-center mt-[5%] mb-8">
      <h1 className="text-3xl font-bold text-red-700">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 mt-2 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthorityPageHeader;
