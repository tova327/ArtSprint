import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";


const ProtectedRoute = ({ children }: { children: any}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;