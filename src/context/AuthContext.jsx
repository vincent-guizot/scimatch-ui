import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    username: "admin",
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("x-user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("x-user", JSON.stringify(userData));
  };

  const logout = () => {
    // setUser(null);
    // localStorage.removeItem("x-user");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
