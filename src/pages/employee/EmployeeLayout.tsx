import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, LogOut, User, KeyRound, PenSquare } from 'lucide-react';

export default function EmployeeLayout() {
  const { user, logout, isEmployee } = useAuth();
  const navigate = useNavigate();

  // Not logged in → go to employee login
  if (!user) return <Navigate to="/employee-login" replace />;

  // If somehow a non-employee ends up here, redirect to admin
  if (!isEmployee) return <Navigate to="/admin" replace />;

  // Must change password → force redirect
  if (user.mustChangePassword) return <Navigate to="/employee/change-password" replace />;

  const handleLogout = () => { logout(); navigate('/employee-login'); };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-700">
          <h1 className="font-serif text-lg font-bold text-white leading-tight">
            Prajatantr Ki Gunj
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Employee Portal</p>
        </div>

        {/* Employee profile card */}
        <div className="mx-3 mt-4 mb-2 bg-gray-800 rounded-xl p-3 flex items-center gap-3">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover border-2 border-brand-500 shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
              <User size={16} className="text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{user.designation}</p>
            <p className="text-xs text-brand-400 font-mono">{user.employeeId}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1">
          <NavLink to="/employee/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <FileText size={16} /> My Articles
          </NavLink>
          <NavLink to="/employee/editor"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <PenSquare size={16} /> Write Article
          </NavLink>
          <NavLink to="/employee/change-password"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <KeyRound size={16} /> Change Password
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
