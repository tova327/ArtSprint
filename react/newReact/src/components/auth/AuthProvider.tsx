import { createContext, useContext } from "react";
import api from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as reduxLogout } from "../../store/userSlice";
import { StoreType } from "../../store/store";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const dispatch = useDispatch();
    const user = useSelector((store: StoreType) => store.user.user);
    const login = async (username: string, password: string) => {
        const res = await api.post("/auth/login", { username, password });
        const token = res.data.token;
        sessionStorage.setItem("authToken", token);
        dispatch(setUser(res.data.user));
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        dispatch(reduxLogout());
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);