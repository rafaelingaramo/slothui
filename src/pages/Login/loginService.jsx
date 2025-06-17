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
export const getUserName = () => { 
  const token = getAuthToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.userName.substring(0,1).toUpperCase() || null;
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
}

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("jwt_exp");
};
