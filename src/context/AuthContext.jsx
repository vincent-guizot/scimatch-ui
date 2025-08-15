import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);

  // Load from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedMatches = localStorage.getItem("matches");
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  // Save matches to localStorage when they change
  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  const login = (username) => {
    setUser({ username });
    localStorage.setItem("user", JSON.stringify({ username }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setMatches([]);
    localStorage.removeItem("matches");
  };

  const addMatch = (match) => {
    if (matches.length >= 3) {
      alert("You can only select up to 3 matches.");
      return;
    }

    setMatches((prev) => {
      if (prev.find((m) => m.id === match.id)) return prev; // prevent duplicate
      return [...prev, match];
    });
  };

  const clearMatches = () => {
    setMatches([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, matches, addMatch, clearMatches }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
