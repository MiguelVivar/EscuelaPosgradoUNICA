import React from 'react';

interface ResolutionLinkProps {
  url: string;
  className?: string;
}

const ResolutionLink: React.FC<ResolutionLinkProps> = ({ 
  url, 
  className = "text-sm text-blue-600 hover:underline" 
}) => {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Ver Resolución
    </a>
  );
};

export default ResolutionLink;
