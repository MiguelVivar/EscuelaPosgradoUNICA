import React from 'react';
import PageHeader from '@/components/layout/PageHeader';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-full">
      <PageHeader />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
