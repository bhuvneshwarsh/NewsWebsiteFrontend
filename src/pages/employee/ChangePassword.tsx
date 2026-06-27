import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ChangePassword() {
  const [current,  setCurrent]  = useState('');
  const [newPwd,   setNewPwd]   = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const strength = (() => {
    if (newPwd.length === 0) return 0;
    let s = 0;
    if (newPwd.length >= 8)               s++;
    if (/[A-Z]/.test(newPwd))             s++;
    if (/[0-9]/.test(newPwd))             s++;
    if (/[^A-Za-z0-9]/.test(newPwd))      s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'][strength];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPwd.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPwd !== confirm) { setError('Passwords do not match.'); return; }
    if (newPwd === current)  { setError('New password must be different from current password.'); return; }

    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: current,
        newPassword:     newPwd,
      });

      // Clear mustChangePassword flag in local session
      updateUser({ mustChangePassword: false });
      navigate('/employee/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to change password. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 to-gray-900
      flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20
            rounded-xl mb-3">
            <KeyRound size={24} className="text-white" />
          </div>
          <h1 className="font-semibold text-white text-lg">Set New Password</h1>
          <p className="text-orange-100 text-xs mt-1">
            You must change your temporary password before continuing.
          </p>
        </div>

        <div className="px-8 py-7">
          {/* Who is logged in */}
          <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-3">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName}
                className="w-9 h-9 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-600 font-bold text-sm">
                  {user?.fullName?.[0] ?? 'E'}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.employeeId} · {user?.designation}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl
              text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Current (Temporary) Password
              </label>
              <div className="relative">
                <input required type={showPwd ? 'text' : 'password'}
                  value={current} onChange={e => setCurrent(e.target.value)}
                  placeholder="Your temporary password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10" />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
              <input required type="password"
                value={newPwd} onChange={e => setNewPwd(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
              {/* Strength bar */}
              {newPwd.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all
                        ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium
                    ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500'
                      : strength === 3 ? 'text-blue-500' : 'text-green-600'}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input required type="password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10" />
                {confirm.length > 0 && newPwd === confirm && (
                  <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2
                    text-green-500" />
                )}
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold
                py-3 rounded-xl transition disabled:opacity-60 text-sm mt-2">
              {saving ? 'Saving…' : 'Set New Password & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
