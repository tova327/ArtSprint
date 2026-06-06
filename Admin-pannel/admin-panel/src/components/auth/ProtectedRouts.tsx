import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";


export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    loading,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <>{children}</>;
}