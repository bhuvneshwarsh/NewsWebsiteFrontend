import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login, user } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authApi.login(email, password);
      console.log('login response', res);
      const raw = res.data as any;
      const success = raw.success ?? raw.Success;
      const message = raw.message ?? raw.Message;
      const data = raw.data ?? raw.Data;

      if (success && data) {
        const userData = {
          token:    data.token ?? data.Token,
          fullName: data.fullName ?? data.FullName,
          email:    data.email ?? data.Email,
          role:     data.role ?? data.Role,
          expiry:   data.expiry ?? data.Expiry,
        };
        login(userData);
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('login error', err);
      setError(err.response?.data?.message ?? err.response?.data?.Message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Prajatantr Ki Gunj</h1>
          <p className="text-gray-500 mt-1 text-sm">Admin Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="admin@prajatantrkigunj.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  Success?: boolean;
  Message?: string;
  Data?: T;
};
