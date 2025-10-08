import React, { createContext, useState, useCallback } from 'react';

export const CacheBusterContext = createContext();

export const CacheBusterProvider = ({ children }) => {
  const [cacheBuster, setCacheBuster] = useState(0);

  const bustCache = useCallback(() => {
    setCacheBuster((prev) => prev + 1);
  }, []);

  return (
    <CacheBusterContext.Provider value={{ cacheBuster, bustCache }}>
      {children}
    </CacheBusterContext.Provider>
  );
};