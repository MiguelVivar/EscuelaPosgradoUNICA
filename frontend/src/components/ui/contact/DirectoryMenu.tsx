import React from 'react';
import { DirectoryMenuProps } from '@/types/contact';
import { Button } from '@/components/common';

export default function DirectoryMenu({ 
  menuItems, 
  selectedItem, 
  onSelectItem 
}: DirectoryMenuProps) {
  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 lg:w-64 w-full mb-4 lg:mb-0">
      {menuItems.map((item) => (
        <Button
          key={item}
          variant={selectedItem === item ? "primary" : "outline"}
          onClick={() => onSelectItem(item)}
          className="justify-start"
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
