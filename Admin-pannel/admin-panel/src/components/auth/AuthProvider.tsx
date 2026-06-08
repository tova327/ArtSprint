import {
  createContext,
  useContext,
  useEffect,
} from "react";
import { axiosClient } from "../../api/axiosClient";
import type { UserDTO } from "../../types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";






type AuthContextType = {
  user: UserDTO | null;
  loading: boolean;

  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<UserDTO>;

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
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        return res.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });
  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res: AxiosResponse<UserDTO> = await axiosClient.post("/auth/login", {
        userName: data.username,
        password: data.password,
      });
      return res.data;
    },
     
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
    },
  });
 

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  useEffect(() => {
    refreshUser();
  }, []);

 

  
    return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login: async (username, password) =>
          await loginMutation.mutateAsync({ username, password }),
        logout: async () => await logoutMutation.mutateAsync(),
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