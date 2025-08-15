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
      // For now, just accept any password since no backend
      login(username);
      navigate("/home");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-red-600">Login</h1>
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
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
