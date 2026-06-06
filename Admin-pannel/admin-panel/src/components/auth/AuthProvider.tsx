import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { axiosClient } from "../../api/axiosClient";
import type { UserDTO } from "../../types/user.types";






type AuthContextType = {
  user: UserDTO | null;
  loading: boolean;

  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<UserDTO | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser = async () => {
    try {
      const res = await axiosClient.get(
        "auth/me",
      );

      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (
    username: string,
    password: string
  ) => {
    await axiosClient.post(
      "/auth/login",
      {
        userName: username,
        password,
      },
     
    );
   

    await refreshUser();
  };

  const logout = async () => {
    try {
      await axiosClient.post(
        "auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        isAdmin: user?.role === "admin",
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};