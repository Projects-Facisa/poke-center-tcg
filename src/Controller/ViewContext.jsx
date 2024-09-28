import React, { createContext, useState, useContext } from 'react';

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [view, setView] = useState(1);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);