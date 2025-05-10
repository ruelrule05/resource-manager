import {useLocation} from "react-router";
import {useAuth} from "../hooks/useAuth.tsx";
import {Navigate, Outlet} from "react-router";
import {Header} from "../components/Header.tsx";

const AuthenticatedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <span className="spinner loading-spinner"></span>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (
    <div className="max-w-full">
      <Header />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthenticatedLayout;