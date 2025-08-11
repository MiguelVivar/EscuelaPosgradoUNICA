import React from 'react';
import { Alert } from '@/components/ui/common';

interface ProfileMessageContainerProps {
  message: { text: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

export default function ProfileMessageContainer({ 
  message, 
  onClose 
}: ProfileMessageContainerProps) {
  if (!message) return null;

  return (
    <div className="mb-6">
      <Alert
        type={message.type}
        message={message.text}
        onClose={onClose}
      />
    </div>
  );
}
