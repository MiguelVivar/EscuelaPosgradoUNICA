import { validateStoredToken, isTokenAboutToExpire } from '@/lib/api';

export const debugTokenStatus = () => {
  if (typeof window === 'undefined') {
    console.log('DEBUG: Running on server side');
    return;
  }

  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  console.log('=== TOKEN DEBUG INFO ===');
  console.log('Token exists:', !!token);
  console.log('User exists:', !!user);
  
  if (token) {
    console.log('Token preview:', `${token.substring(0, 20)}...`);
    console.log('Token is valid:', validateStoredToken());
    console.log('Token about to expire:', isTokenAboutToExpire(token));
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', {
        iat: new Date(payload.iat * 1000).toISOString(),
        exp: new Date(payload.exp * 1000).toISOString(),
        sub: payload.sub,
        role: payload.role || payload.authorities
      });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  if (user) {
    try {
      const userObj = JSON.parse(user);
      console.log('User info:', {
        email: userObj.email,
        role: userObj.role,
        nombres: userObj.nombres
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  console.log('========================');
};

// Function to call from console for debugging
if (typeof window !== 'undefined') {
  (window as any).debugTokenStatus = debugTokenStatus;
}
