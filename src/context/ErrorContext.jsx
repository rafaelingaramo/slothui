import React, { createContext, useContext, useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";

export const ErrorContext = createContext();
export const useError = () => useContext(ErrorContext);

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const showError = (message) => setError(message);
  const clearError = () => setError(null);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs bg-red-500 text-white rounded-lg shadow-lg px-4 py-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="text-xl text-white" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

    </ErrorContext.Provider>
  );
}