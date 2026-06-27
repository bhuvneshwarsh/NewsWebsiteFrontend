import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { KeyRound, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

export default function ChangePassword() {
  const [current,  setCurrent]  = useState('');
  const [newPwd,   setNewPwd]   = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const [done,     setDone]     = useState(false);

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const isForced = user?.mustChangePassword === true;

  // ── Password strength ──────────────────────────────────────────────────────
  const strength = (() => {
    if (!newPwd) return 0;
    let s = 0;
    if (newPwd.length >= 8)          s++;
    if (/[A-Z]/.test(newPwd))        s++;
    if (/[0-9]/.test(newPwd))        s++;
    if (/[^A-Za-z0-9]/.test(newPwd)) s++;
    return s;
  })();

  const strengthMeta = [
    { label: '',       color: '' },
    { label: 'Weak',   color: 'bg-red-400'   },
    { label: 'Fair',   color: 'bg-amber-400'  },
    { label: 'Good',   color: 'bg-blue-400'   },
    { label: 'Strong', color: 'bg-green-500'  },
  ][strength];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!current)           { setError('Please enter your current password.'); return; }
    if (newPwd.length < 8)  { setError('New password must be at least 8 characters.'); return; }
    if (newPwd !== confirm)  { setError('Passwords do not match.'); return; }
    if (newPwd === current)  { setError('New password must be different from the current one.'); return; }

    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: current,
        newPassword:     newPwd,
      });

      // Clear mustChangePassword from local session
      updateUser({ mustChangePassword: false });
      setDone(true);

      // After 1.5s redirect to dashboard
      setTimeout(() => navigate('/employee/dashboard'), 1500);

    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        'Failed to change password. Please check your current password and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Password Changed!</h2>
          <p className="text-gray-500 text-sm">Taking you to your dashboard…</p>
          <div className="mt-4 w-8 h-8 border-4 border-brand-200 border-t-brand-600
            rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className={`flex items-center justify-center min-h-screen p-4
      ${isForced
        ? 'bg-gradient-to-br from-brand-700 via-brand-800 to-gray-900'
        : 'bg-gray-50'}`}>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className={`px-8 py-6 text-center
          ${isForced
            ? 'bg-gradient-to-r from-amber-500 to-orange-600'
            : 'bg-gradient-to-r from-brand-600 to-brand-800'}`}>
          <div className="inline-flex items-center justify-center w-12 h-12
            bg-white/20 rounded-xl mb-3">
            <KeyRound size={24} className="text-white" />
          </div>
          <h1 className="font-semibold text-white text-lg">
            {isForced ? 'Set Your New Password' : 'Change Password'}
          </h1>
          <p className="text-white/70 text-xs mt-1">
            {isForced
              ? 'You must change your temporary password before you can continue.'
              : 'Update your account password below.'}
          </p>
        </div>

        <div className="px-8 py-7">

          {/* Logged-in user info */}
          {user && (
            <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-3
              border border-gray-100">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center
                  justify-center shrink-0">
                  <span className="text-brand-600 font-bold">
                    {user.fullName?.[0] ?? 'E'}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user.employeeId} · {user.designation}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl
              text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Current password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {isForced ? 'Temporary Password (shared by admin)' : 'Current Password'}
              </label>
              <div className="relative">
                <input
                  required
                  type={showCurr ? 'text' : 'password'}
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  placeholder={isForced ? 'e.g. Pkg@2026#00001' : 'Your current password'}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 pr-11"
                />
                <button type="button" onClick={() => setShowCurr(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600">
                  {showCurr ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {isForced && (
                <p className="text-xs text-gray-400 mt-1">
                  Format: <span className="font-mono">Pkg@YYYY#NNNNN</span>
                  &nbsp;(e.g. Pkg@2026#00001)
                </p>
              )}
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showNew ? 'text' : 'password'}
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 pr-11"
                />
                <button type="button" onClick={() => setShowNew(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPwd.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300
                          ${i <= strength ? strengthMeta.color : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  {strengthMeta.label && (
                    <p className={`text-xs font-medium
                      ${strength <= 1 ? 'text-red-500'
                        : strength === 2 ? 'text-amber-500'
                        : strength === 3 ? 'text-blue-500'
                        : 'text-green-600'}`}>
                      {strengthMeta.label}
                      {strength < 3 && ' — add uppercase letters, numbers or symbols'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-500 pr-11"
                />
                {confirm.length > 0 && newPwd === confirm && (
                  <CheckCircle size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || newPwd.length < 8 || newPwd !== confirm}
              className="w-full flex items-center justify-center gap-2 bg-brand-600
                hover:bg-brand-700 disabled:opacity-50 text-white font-semibold
                py-3 rounded-xl transition text-sm mt-2">
              {saving
                ? 'Saving…'
                : <><KeyRound size={15} /> {isForced ? 'Set Password & Continue' : 'Update Password'}
                    <ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Password tips */}
          <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-2">Strong password tips:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className={newPwd.length >= 8 ? 'text-green-600' : ''}>
                {newPwd.length >= 8 ? '✓' : '·'} At least 8 characters
              </li>
              <li className={/[A-Z]/.test(newPwd) ? 'text-green-600' : ''}>
                {/[A-Z]/.test(newPwd) ? '✓' : '·'} At least one uppercase letter
              </li>
              <li className={/[0-9]/.test(newPwd) ? 'text-green-600' : ''}>
                {/[0-9]/.test(newPwd) ? '✓' : '·'} At least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(newPwd) ? 'text-green-600' : ''}>
                {/[^A-Za-z0-9]/.test(newPwd) ? '✓' : '·'} At least one special character (!@#$)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}