import { useState, useEffect, createContext, useContext } from "react";
import {API_URI} from "../lib/constants.ts";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, expiresIn: number, userData?: any) => void;
  logout: () => void;
  user: any | null;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  let refreshTokenTimeoutId = null;

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("tokenExpiry");

      setIsLoading(true);

      if (token && expiry && parseInt(expiry, 10) > Date.now()) {
        setIsAuthenticated(true);
        scheduleRefreshToken(parseInt(expiry, 10));
        try {
          const response = await fetch(API_URI + '/auth/me', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    }

    checkAuthOnLoad();

    return () => {
      if (refreshTokenTimeoutId) {
        clearTimeout(refreshTokenTimeoutId);
      }
    }
  }, [])

  const login = (token: string, expiresIn: number, userData?: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", (Date.now() + expiresIn * 1000).toString())
    setIsAuthenticated(true);
    setUser(userData || null);
    scheduleRefreshToken(Date.now() + expiresIn * 1000);
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setIsAuthenticated(false);
    setUser(null);

    if (refreshTokenTimeoutId) {
      clearTimeout(refreshTokenTimeoutId);
      refreshTokenTimeoutId = null;
    }
  }

  const refreshToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      logout();
      return false;
    }

    try {
      const response = await fetch(API_URI + "/auth/refresh-token", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      if (response.ok) {
        const { access_token, expires_in } = await response.json();

        localStorage.setItem("token", access_token);
        localStorage.setItem("tokenExpiry", (Date.now() + expires_in * 1000).toString())
        setIsAuthenticated(true);
        scheduleRefreshToken(Date.now() + expires_in * 1000);

        return true;
      } else {
        logout();

        return false;
      }
    } catch (error) {
      console.log("Failed to refresh token: ", error);

      logout();

      return false;
    }
  }

  const scheduleRefreshToken = (expiry: number) => {
    const timeUntilExpiry = expiry - Date.now();
    const refreshTimeout = Math.max(0, timeUntilExpiry - (5 * 60 * 1000));

    if (refreshTimeout > 0) {
      refreshTokenTimeoutId = setTimeout(refreshToken, refreshTimeout);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user,
    refreshToken,
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