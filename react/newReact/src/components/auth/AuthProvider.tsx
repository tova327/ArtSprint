import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as reduxLogout, UserType } from "../../store/userSlice";
import { StoreType } from "../../store/store";
import { AppSpinner } from "../common/AppSpinner";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const dispatch = useDispatch();
    const user = useSelector((store: StoreType) => store.user.user);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = sessionStorage.getItem("authToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.post("/auth/authuser",{ token}, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                dispatch(setUser(res.data));
            } catch {
                sessionStorage.removeItem("authToken");
            }

            setLoading(false);
        };

        initAuth();
    }, [dispatch]);

    const login = async (user: { username: string, password: string }) => {
        const data = {
            userName: user.username,
            password: user.password
        }
        const res = await api.post("/auth/login", data, {
            withCredentials: true
        });

        const token = res.data.token;
        sessionStorage.setItem("authToken", token);

        dispatch(setUser(res.data.user));
    };
    const register = async (userDetails: { name: string, email: string, password: string, birthDate: string }) => {
        const data = {
            name: userDetails.name,
            email: userDetails.email,
            password: userDetails.password,
            birthDate: userDetails.birthDate
        };
        const res = await api.post("/auth/register", data, {
            withCredentials: true
        });
        const token = res.data.token;
        sessionStorage.setItem("authToken", token);
        dispatch(setUser(res.data.user));
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        dispatch(reduxLogout());
    };

    if (loading) return <AppSpinner />;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user && user?.id !== 0
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
type AuthContextType = {
    user: UserType | null
    login: (user: { username: string, password: string }) => Promise<void>
    register: (userDetails: { name: string, email: string, password: string, birthDate: string }) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}
export const useAuth = () => useContext<AuthContextType>(AuthContext);