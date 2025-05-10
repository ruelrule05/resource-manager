import {Link} from "react-router";
import {Header} from "./Header.tsx";
import {useAuth} from "../hooks/useAuth.tsx";

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Resource Management
          </h1>

          { !isAuthenticated ? (
            <div className="space-x-4">
              <Link to="/login" className="">Login</Link>
              <Link to="/register" className="">Register</Link>
            </div>
          ) : (
            <div>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;