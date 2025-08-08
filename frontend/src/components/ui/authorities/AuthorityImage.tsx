import React from 'react';
import Image from 'next/image';

interface AuthorityImageProps {
  src: string;
  alt: string;
  className?: string;
}

const AuthorityImage: React.FC<AuthorityImageProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-contain" 
}) => {
  return (
    <div className="w-full h-64">
      <Image
        src={src}
        alt={alt}
        className={className}
        width={500}
        height={500}
      />
    </div>
  );
};

export default AuthorityImage;
