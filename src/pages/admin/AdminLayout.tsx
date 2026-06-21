import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Image, Newspaper, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/admin',         label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/articles',label: 'Articles',     icon: FileText },
  { to: '/admin/editor',  label: 'New Article',  icon: FileText },
  { to: '/admin/media',   label: 'Media',        icon: Image },
  { to: '/admin/epaper',  label: 'E-Paper',      icon: Newspaper },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'User') return <Navigate to="/" replace />;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-700">
          <h1 className="font-serif text-xl font-bold text-white">Prajatantr Ki Gunj</h1>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                ${isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-1">{user.fullName}</div>
          <div className="text-xs text-gray-500 mb-3">{user.role}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
          >
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
