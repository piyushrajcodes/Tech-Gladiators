import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './LoginPage.css'; // Removed custom CSS

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend login to get JWT token
      const res = await axios.post('/api/login', { email, password });
      const token = res.data.token;

      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto">
        {/* Left Aligned Text */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:pr-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Proactive wellness is now Right at your fingertips with HealthMitra
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto md:mx-0">
            With access to <b>Early Warning System</b> from diseases in your region, <b>Real-Time Health Monitoring</b> with BMI calculator <b>AI Powered Disease Detection</b> to detect diseases according to your symptoms.
          </p>
        </div>

        {/* Right Aligned Card */}
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">HealthMitra Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
                >
                  Login
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <p className="text-center text-gray-400 text-sm mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;