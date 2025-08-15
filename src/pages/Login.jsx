import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username);
      navigate("/home");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 w-80 rounded-lg shadow-lg flex flex-col items-center">
        {/* Logo container */}
        <div className="w-24 h-24 mb-4 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="logo"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <h3 className="text-2xl font-bold mb-4 text-center">Login</h3>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

