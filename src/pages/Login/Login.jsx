import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginService } from "./loginService"; // your login API function

function Login() {
  const [userName, setUserName] = useState("");
  const [passkey, setPasskey] = useState("");
  const navigate = useNavigate();

  const { login } = useLoginService();

 const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(userName, passkey);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
