import React from 'react';

interface AuthoritiesPageLayoutProps {
  children: React.ReactNode;
}

const AuthoritiesPageLayout: React.FC<AuthoritiesPageLayoutProps> = ({ children }) => {
  return (
    <main className="p-8 bg-zinc-100 min-h-screen mt-20">
      {children}
    </main>
  );
};

export default AuthoritiesPageLayout;
