import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function EmployeeLogin() {
  const [employeeId, setEmployeeId] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post<{
        success: boolean; message: string;
        data: {
          token: string; fullName: string; email: string; role: string;
          employeeId: string; designation: string; imageUrl: string | null;
          mustChangePassword: boolean; expiry: string;
        }
      }>('/auth/employee-login', {
        employeeId: employeeId.trim().toUpperCase(),
        password,
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      const d = res.data.data;
      login({
        token:              d.token,
        fullName:           d.fullName,
        email:              d.email,
        role:               d.role,
        expiry:             d.expiry,
        employeeId:         d.employeeId,
        designation:        d.designation,
        imageUrl:           d.imageUrl ?? undefined,
        mustChangePassword: d.mustChangePassword,
      });

      // Force password change on first login
      if (d.mustChangePassword) {
        navigate('/employee/change-password');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-brand-800 to-gray-900
      flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-7 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20
            rounded-2xl mb-3">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Employee Portal</h1>
          <p className="text-brand-200 text-sm mt-1">Prajatantr Ki Gunj</p>
        </div>

        <div className="px-8 py-7">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl
              text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Employee ID
              </label>
              <input
                required
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value.toUpperCase())}
                placeholder="EMP-2026-00001"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                  font-mono font-semibold tracking-widest uppercase
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent pr-11"
                />
                <button type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold
                py-3 rounded-xl transition disabled:opacity-60 text-sm mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-400">
              Login first time? Use the temporary password shared by your administrator.
            </p>
            <Link to="/login"
              className="text-xs text-brand-600 hover:underline font-medium">
              Admin login →
            </Link>
            <div className="text-center text-sm text-gray-500 mt-2">
            <span>Go to Home page </span>
            <a href="/" className="text-brand-600 hover:underline">Home</a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
