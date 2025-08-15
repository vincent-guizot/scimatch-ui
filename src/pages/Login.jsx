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
    <div className="flex items-center justify-center h-screen">
      <div>
        <img src="/" alt="logo"/>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
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
  );
}

