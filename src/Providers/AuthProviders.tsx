/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hook/useAxiosPublic";
import type { ReactNode } from "react";

interface IUser {
  id?: string;
  email: string;
  role: string;
}

interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProviders = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await axiosPublic.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);

      const decoded = parseJwt(accessToken);
      if (decoded) {
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        });
      }
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = (): void => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        });
      }
    }
    setLoading(false);
  }, []);

  function parseJwt(token: string): any | null {
    try {
      const base64 = token.split(".")[1];
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  }

  const authInfo: IAuthContext = {
    user,
    loading,
    login,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProviders;
