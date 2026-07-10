import { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Image, Newspaper,
  LogOut, Users, Megaphone, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin',          label: 'Dashboard',      icon: LayoutDashboard, end: true },
  { to: '/admin/articles', label: 'Articles',       icon: FileText  },
  { to: '/admin/editor',   label: 'New Article',    icon: FileText  },
  { to: '/admin/media',    label: 'Media',          icon: Image     },
  { to: '/admin/epaper',   label: 'E-Paper',        icon: Newspaper },
  { to: '/admin/team',     label: 'Team Manager',   icon: Users     },
  { to: '/admin/ads',      label: 'Advertisements', icon: Megaphone },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Desktop: collapsed = icon-only sidebar (48px wide)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  // Mobile: sidebarOpen = drawer open over content
  const [mobileOpen, setMobileOpen] = useState(false);
  // Track mobile vs desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'User') return <Navigate to="/" replace />;

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebarWidth = desktopCollapsed ? 'w-14' : 'w-60';

  // ── Sidebar content ────────────────────────────────────────────────────────
  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className={`border-b border-gray-700 flex items-center
        ${collapsed ? 'justify-center px-2 py-4' : 'px-5 py-5'}`}>
        {collapsed ? (
          <span className="text-brand-500 font-black text-lg">P</span>
        ) : (
          <div>
            <h1 className="font-serif text-lg font-bold text-white leading-tight">
              Prajatantr Ki Gunj
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${collapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-brand-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
            }>
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className={`border-t border-gray-700 p-3
        ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        {!collapsed && (
          <div className="mb-2 px-1">
            <p className="text-xs text-white font-medium truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white
            transition px-1 py-1.5 rounded-lg hover:bg-gray-800 w-full
            ${collapsed ? 'justify-center' : ''}">
          <LogOut size={15} className="shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── MOBILE: Overlay backdrop ─────────────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: Drawer sidebar ────────────────────────────────────────── */}
      {isMobile && (
        <aside className={`fixed top-0 left-0 h-full z-50 bg-gray-900 text-white
          w-64 transition-transform duration-300 ease-in-out shadow-2xl
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white
              transition p-1.5 rounded-lg hover:bg-gray-800 z-10">
            <X size={20} />
          </button>

          <SidebarContent collapsed={false} />
        </aside>
      )}

      {/* ── DESKTOP: Static collapsible sidebar ──────────────────────────── */}
      {!isMobile && (
        <aside className={`relative bg-gray-900 text-white flex flex-col shrink-0
          transition-all duration-300 ease-in-out ${sidebarWidth}`}>

          <SidebarContent collapsed={desktopCollapsed} />

          {/* Desktop collapse toggle button */}
          <button
            onClick={() => setDesktopCollapsed(c => !c)}
            className="absolute -right-3 top-20 bg-gray-700 hover:bg-brand-600
              text-white rounded-full p-1 shadow-lg border border-gray-600
              transition-colors z-10">
            {desktopCollapsed
              ? <ChevronRight size={14} />
              : <ChevronLeft  size={14} />}
          </button>
        </aside>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 px-4 py-3
            flex items-center gap-3 shrink-0 shadow-sm">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition
                text-gray-700">
              <Menu size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif font-bold text-gray-800 text-sm truncate">
                Prajatantr Ki Gunj
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center
                justify-center text-white text-xs font-bold">
                {user.fullName?.[0] ?? 'A'}
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}