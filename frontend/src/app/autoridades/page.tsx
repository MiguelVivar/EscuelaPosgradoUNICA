'use client';

import React from 'react';
import { 
  AuthorityPageHeader, 
  AuthorityGrid, 
  AuthoritiesPageLayout 
} from '@/components/ui/authorities';
import { useAuthorities } from '@/hooks/authorities';
import { LoadingSpinner } from '@/components/common';

const AuthoritiesPage: React.FC = () => {
  const { authorities, loading, error } = useAuthorities();

  if (loading) {
    return (
      <AuthoritiesPageLayout>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner />
        </div>
      </AuthoritiesPageLayout>
    );
  }

  if (error) {
    return (
      <AuthoritiesPageLayout>
        <div className="text-center text-red-600 min-h-64 flex items-center justify-center">
          <p>{error}</p>
        </div>
      </AuthoritiesPageLayout>
    );
  }

  return (
    <AuthoritiesPageLayout>
      <AuthorityPageHeader 
        title="Autoridades y Jurados" 
      />
      <AuthorityGrid authorities={authorities} />
    </AuthoritiesPageLayout>
  );
};

export default AuthoritiesPage;
