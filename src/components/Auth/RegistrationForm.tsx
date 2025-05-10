import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {API_URI} from "../../lib/constants.ts";

export function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string|null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');

      return
    }

    try {
      const response = await fetch( API_URI + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name, email, password, password_confirmation: passwordConfirmation
        })
      })

      if (response.ok) {
        const data = await response.json();

        console.log("Success:", data);

        navigate('/dashboard');
      } else {
        const error = await response.json();
        setError(error.message)
      }
    } catch (error: any) {
      setError(error.message || 'Failed to register')
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Register</h2>

          { error && <p className="text-red-500 mb-4">{error}</p> }

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
              <input type="text" className="shadow border rounded w-full py-2 px-3 text-gray-700"
                     id="name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
              />
            </div>

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

            <div>
              <label htmlFor="passwordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
              <input type="password" className="shadow border rounded w-full py-2 px-3 text-gray-700"
                     id="password"
                     value={passwordConfirmation}
                     onChange={(e) => setPasswordConfirmation(e.target.value)}
                     required
              />
            </div>

            <div className="flex flex-col items-center justify-between space-y-4">
              <button type="submit" className="btn btn-primary btn-block font-bold">Register</button>
              <Link to="/login" className="btn btn-text btn-primary btn-block">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}