import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
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
      const res = await api.post<{
        success: boolean;
        message: string;
        data: {
          token:    string;
          fullName: string;
          email:    string;
          role:     string;
          expiry:   string;
        };
      }>('/auth/login', { email: email.trim(), password });

      if (!res.data.success) {
        setError(res.data.message || 'Login failed. Please try again.');
        return;
      }

      const d = res.data.data;
      login({
        token:    d.token,
        fullName: d.fullName,
        email:    d.email,
        role:     d.role,
        expiry:   d.expiry,
      });

      // Redirect based on role
      if (d.role === 'Employee') {
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
        setError(err.response?.data?.message ?? 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 to-gray-900
      flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-white">
            Prajatantr Ki Gunj
          </h1>
          <p className="text-brand-200 text-sm mt-1">Admin Portal</p>
        </div>

        <div className="px-8 py-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl
              text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5
                uppercase tracking-wide">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@prajatantrkigunj.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5
                uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white
                font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link to="/" className="text-sm text-gray-400 hover:text-brand-600 transition">
              Go to Home page{' '}
              <span className="text-brand-600 font-medium">Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}