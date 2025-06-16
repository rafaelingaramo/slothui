// auth.js
export const isTokenValid = () => {
  const exp = localStorage.getItem("jwt_exp");
  return exp && Date.now() < parseInt(exp, 10);
};
