import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface LoginData {
  token?: string;
  Token?: string;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  role?: string;
  Role?: string;
  expiry?: string;
  Expiry?: string;
}

interface LoginResponse {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: LoginData;
  Data?: LoginData;
}

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      // Direct api call to /auth/login
      // baseURL is /api so full URL becomes /api/auth/login
      const res = await api.post<LoginResponse>('/auth/login', {
        email: email.trim(),
        password,
      });
      const response = res.data;
      const data = response.data ?? response.Data;

      if (!(response.success ?? response.Success) || !data) {
        setError(response.message ?? response.Message ?? 'Login failed. Please try again.');
        return;
      }

      const token = data.token ?? data.Token;
      const fullName = data.fullName ?? data.FullName;
      const userEmail = data.email ?? data.Email;
      const role = data.role ?? data.Role;
      const expiry = data.expiry ?? data.Expiry;
      if (!token || !fullName || !userEmail || !role || !expiry) {
        setError('The server returned an incomplete login response. Please contact the administrator.');
        return;
      }

      login({
        token,
        fullName,
        email: userEmail,
        role,
        expiry,
      });

      // Redirect based on role
      if (role === 'Employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 405) {
        setError('Server configuration error (405). Please contact the administrator.');
      } else if (status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(
          err.response?.data?.message ??
          err.response?.data?.Message ??
          'Login failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Prajatantr Ki Gunj
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Admin Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg
            text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="admin@prajatantrkigunj.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white
              font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="text-center text-sm text-gray-500 mt-2">
            <span>Go to Home page </span>
            <Link to="/" className="text-brand-600 hover:underline">Home</Link>
          </div>
        </form>
      </div>
    </div>
  );
}