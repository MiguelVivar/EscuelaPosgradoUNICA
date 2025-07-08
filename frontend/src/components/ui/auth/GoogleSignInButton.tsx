"use client";

import { useEffect, useRef } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
      id: {
        initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string; error?: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        }) => void;
        renderButton: (element: HTMLElement, options: {
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'large' | 'medium' | 'small';
        width?: string;
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        logo_alignment?: 'left' | 'center';
        }) => void;
      };
      };
    };
    googleSignInCallback?: (response: { credential?: string; error?: string }) => void;
  }
}

export default function GoogleSignInButton({ 
  onSuccess, 
  onError, 
  disabled = false 
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configurar el callback global
    window.googleSignInCallback = (response: { credential?: string; error?: string }) => {
      if (response.credential) {
      onSuccess(response.credential);
      } else {
      onError(new Error('No se recibió credencial de Google'));
      }
    };

    // Función para inicializar Google Sign-In
    const initializeGoogleSignIn = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: window.googleSignInCallback!,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    };

    // Cargar el script de Google Sign-In si no está ya cargado
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => onError(new Error('Error al cargar Google Sign-In'));
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeGoogleSignIn();
    }

    // Cleanup
    return () => {
      if (window.googleSignInCallback) {
        delete window.googleSignInCallback;
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full">
      <div 
        ref={buttonRef} 
        className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '44px'
        }}
      />
    </div>
  );
}
