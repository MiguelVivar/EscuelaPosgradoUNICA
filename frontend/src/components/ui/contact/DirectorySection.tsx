import React from 'react';
import DirectoryMenu from './DirectoryMenu';
import DirectoryTable from './DirectoryTable';
import { DirectoryMenuProps, DirectorySection as DirectorySectionType } from '@/types/contact';

interface DirectorySectionProps extends DirectoryMenuProps {
  currentSection: DirectorySectionType;
}

export default function DirectorySection({ 
  menuItems,
  selectedItem,
  onSelectItem,
  currentSection
}: DirectorySectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
      <DirectoryMenu 
        menuItems={menuItems}
        selectedItem={selectedItem}
        onSelectItem={onSelectItem}
      />

      <div className="flex-1 min-w-0">
        <DirectoryTable section={currentSection} />
        
        <div className="h-20" />
      </div>
    </div>
  );
}
