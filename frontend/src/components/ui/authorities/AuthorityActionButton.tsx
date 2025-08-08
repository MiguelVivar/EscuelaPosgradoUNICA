import React from 'react';
import Link from 'next/link';

interface AuthorityActionButtonProps {
  authority: {
    id: string;
    externalLink?: string;
  };
}

const AuthorityActionButton: React.FC<AuthorityActionButtonProps> = ({ authority }) => {
  const baseClassName = "inline-block w-full px-4 py-2 bg-amber-500 text-white text-center rounded hover:bg-amber-600 transition-colors";

  if (authority.externalLink) {
    return (
      <a
        href={authority.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
      >
        Ver Más
      </a>
    );
  }

  return (
    <Link href={`/autoridades/${authority.id}`}>
      <div className={baseClassName}>
        Ver Más
      </div>
    </Link>
  );
};

export default AuthorityActionButton;
