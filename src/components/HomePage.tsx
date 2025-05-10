import {Link} from "react-router";
import {Header} from "./Header.tsx";

function HomePage() {
  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Resource Management
          </h1>

          <div className="space-x-4">
            <Link to="/login" className="">Login</Link>
            <Link to="/register" className="">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;