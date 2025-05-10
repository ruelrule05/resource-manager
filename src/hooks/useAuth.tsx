import { useState, useEffect, createContext, useContext } from "react";
import {API_URI} from "../lib/constants.ts";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      const token = localStorage.getItem("token");

      setIsLoading(true);

      if (token) {

        try {
          const response = await fetch(API_URI + "/me", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch {
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    }

    checkAuthOnLoad();
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  }

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth musth be used within an AuthProvider")
  }

  return context;
}