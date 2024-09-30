import { createContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const loadingIsTrue = () => {
    setLoading(true);
  };

  const loadingIsFalse = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ loading, loadingIsTrue, loadingIsFalse }}>
      {children}
    </LoadingContext.Provider>
  );
};
