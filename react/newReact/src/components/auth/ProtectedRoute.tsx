import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";


const ProtectedRoute = ({ children }: { children: any}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation()

  if (!isAuthenticated) {
   return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children;
};

export default ProtectedRoute; 