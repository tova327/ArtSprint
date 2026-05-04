import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  logout as reduxLogout,
  UserType,
} from "../../store/userSlice";
import { StoreType } from "../../store/store";
import { AppSpinner } from "../common/AppSpinner";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store: StoreType) => store.user.user);
  const [loading, setLoading] = useState(true);

  // --------------------
  // INIT AUTH
  // --------------------
  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/auth/authuser", { token });
        dispatch(setUser(res.data.user ?? res.data));
      } catch {
        logout();
      }

      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  // --------------------
  // LISTEN GLOBAL LOGOUT
  // --------------------
  useEffect(() => {
    const handleLogout = () => logout();

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // --------------------
  // LOGIN
  // --------------------
  const login = async (userData: {
    username: string;
    password: string;
  }) => {
    const res = await api.post("/auth/login", {
      userName: userData.username,
      password: userData.password,
    });

    const token = res.data.token;

    sessionStorage.setItem("authToken", token);

    dispatch(setUser(res.data.user));

    navigate("/");
  };

  // --------------------
  // REGISTER
  // --------------------
  const register = async (userDetails: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  }) => {
    const res = await api.post("/auth/register", userDetails);

    const token = res.data.token;

    sessionStorage.setItem("authToken", token);

    dispatch(setUser(res.data.user));

    navigate("/");
  };

  // --------------------
  // LOGOUT
  // --------------------
  const logout = () => {
    sessionStorage.removeItem("authToken");

    dispatch(reduxLogout());

    navigate("/login");
  };

  if (loading) return <AppSpinner />;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: user !== null && user?.id !== 0,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
// TYPES
// --------------------
type AuthContextType = {
  user: UserType | null;
  login: (user: {
    username: string;
    password: string;
  }) => Promise<void>;
  register: (userDetails: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};