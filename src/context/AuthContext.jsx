// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("x-user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, []);

  const login = (userData) => {
    if (!userData) return console.error("No user data provided for login!");
    try {
      setUser(userData);
      localStorage.setItem("x-user", JSON.stringify(userData));
      console.log("User saved to localStorage:", userData);
    } catch (err) {
      console.error("Failed to save user to localStorage:", err);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("x-user");
      console.log("User logged out, localStorage cleared");
    } catch (err) {
      console.error("Failed to remove user from localStorage:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming auth context
export function useAuth() {
  return useContext(AuthContext);
}
