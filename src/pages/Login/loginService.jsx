import { useContext } from "react";
import { ErrorContext } from "../../context/ErrorContext";

const API_URL = "http://localhost:8080/api/login";

// Hook-based function for components
export const useLoginService = () => {
  const { showError } = useContext(ErrorContext);

  const login = async (userName, passkey) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, passkey }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const { token, exp } = await response.json();
      localStorage.setItem("jwt", token);
      localStorage.setItem("jwt_exp", exp);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      showError("Login failed. Please check your credentials.");
      return false;
    }
  };

  return { login };
};

// Utility functions (non-reactive)
export const isTokenValid = () => {
  const token = localStorage.getItem("jwt");
  const exp = localStorage.getItem("jwt_exp");
  return token && exp && Date.now() < parseInt(exp, 10);
};

export const getAuthToken = () => localStorage.getItem("jwt");

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("jwt_exp");
};
