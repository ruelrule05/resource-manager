import {useAuth} from "../hooks/useAuth.tsx";
import {Navigate, Outlet} from "react-router";

function RedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <span className="spinner loading-spinner"></span>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RedirectIfAuthenticated;