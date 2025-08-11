import React from 'react';
import BackgroundDecorations from './BackgroundDecorations';
import PatternOverlay from './PatternOverlay';
import ContentContainer from './ContentContainer';
import PageBackground from './PageBackground';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  showDecorations?: boolean;
  showPattern?: boolean;
  gradient?: string;
  className?: string;
}

export default function AuthPageLayout({ 
  children,
  showDecorations = true,
  showPattern = true,
  gradient,
  className = ""
}: AuthPageLayoutProps) {
  return (
    <PageBackground gradient={gradient} className={className}>
      {showDecorations && <BackgroundDecorations />}
      
      {showPattern && <PatternOverlay />}
      
      <ContentContainer>
        {children}
      </ContentContainer>
    </PageBackground>
  );
}
