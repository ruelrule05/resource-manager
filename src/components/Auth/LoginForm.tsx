import {useEffect, useState} from "react";
import {API_URI} from "../../lib/constants.ts";
import {Link, useLocation, useNavigate} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";

function LoginForm () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>('');
  const { login, isAuthenticated } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(API_URI + "/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email, password
        })
      })

      if (response.ok) {
        const { access_token, expires_in } = await response.json();

        login(access_token, expires_in);

        navigate(location.state?.from?.pathname || '/dashboard')
      } else {
        const error = await response.json();

        setError(error.error || "Unable to login");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred while trying to login.");
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form noValidate onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input type="email" className="shadow border rounded w-full py-2 px-3 text-gray-700"
                     id="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
              <input type="password" className="shadow border rounded w-full py-2 px-3 text-gray-700"
                     id="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
              />
            </div>

            <div className="flex flex-col items-center justify-between space-y-4">
              <button type="submit" className="btn btn-primary btn-block font-bold">Login</button>
              <Link to="/register" className="btn btn-text btn-primary btn-block">Don't have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginForm;