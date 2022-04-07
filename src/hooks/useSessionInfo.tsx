import React, { useState } from 'react';

export const useSessionInfo = () => {
  const [auth, setAuth] = useState<string>(() => {
    const initialValue = sessionStorage.getItem('auth');
    return initialValue || '';
  });
  const [user, setUser] = useState<string | undefined>(() => {
    const initialValue = sessionStorage.getItem('user') as any;
    return (
      (initialValue instanceof Object && JSON.parse(initialValue)) || undefined
    );
  });

  return {
    auth: auth,
    user: user,
  };
};
