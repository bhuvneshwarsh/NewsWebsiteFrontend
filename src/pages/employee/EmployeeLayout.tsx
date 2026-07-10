import { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, LogOut, User, KeyRound,
  PenSquare, HelpCircle, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function EmployeeLayout() {
  const { user, logout, isEmployee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [isMobile,         setIsMobile]         = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!user)       return <Navigate to="/employee-login" replace />;
  if (!isEmployee) return <Navigate to="/admin" replace />;

  const isOnChangePassword = location.pathname === '/employee/change-password';
  if (user.mustChangePassword && !isOnChangePassword)
    return <Navigate to="/employee/change-password" replace />;

  const handleLogout = () => { logout(); navigate('/employee-login'); };

  const navItems = [
    ...(!user.mustChangePassword ? [
      { to: '/employee/dashboard', label: 'My Articles',  icon: FileText    },
      { to: '/employee/editor',    label: 'Write Article', icon: PenSquare   },
    ] : []),
    {
      to:    '/employee/change-password',
      label: user.mustChangePassword ? 'Set Password ⚠️' : 'Change Password',
      icon:  KeyRound,
    },
  ];

  // ── Sidebar inner content (shared by mobile + desktop) ────────────────────
  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className={`border-b border-gray-700
        ${collapsed ? 'flex justify-center items-center px-2 py-4' : 'px-5 py-5'}`}>
        {collapsed ? (
          <span className="text-brand-500 font-black text-lg">P</span>
        ) : (
          <div>
            <h1 className="font-serif text-lg font-bold text-white leading-tight">
              Prajatantr Ki Gunj
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Employee Portal</p>
          </div>
        )}
      </div>

      {/* Profile card — only when not collapsed */}
      {!collapsed && (
        <div className="mx-3 mt-4 mb-2 bg-gray-800 rounded-xl p-3
          flex items-center gap-3">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover
                border-2 border-brand-500 shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-brand-600
              flex items-center justify-center shrink-0">
              <User size={16} className="text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.designation}</p>
            <p className="text-xs text-brand-400 font-mono">{user.employeeId}</p>
          </div>
        </div>
      )}

      {/* Collapsed: small avatar */}
      {collapsed && (
        <div className="flex justify-center mt-3 mb-2">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border-2 border-brand-500" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-600
              flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          )}
        </div>
      )}

      {/* Warning banner when password must change */}
      {!collapsed && user.mustChangePassword && (
        <div className="mx-3 mb-2 bg-amber-900/40 border border-amber-700/50
          rounded-xl px-3 py-2.5">
          <p className="text-xs text-amber-300 font-medium leading-snug">
            ⚠️ पासवर्ड बदलना जरूरी है।
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${collapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-brand-600 text-white'
                : user.mustChangePassword && to === '/employee/change-password'
                  ? 'text-amber-300 hover:bg-gray-800'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
            }>
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        {/* Help guide link */}
        <a
          href="/employee-guide"
          target="_blank"
          rel="noreferrer"
          title={collapsed ? 'Help Guide' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-gray-400 hover:bg-gray-800 hover:text-white transition
            ${collapsed ? 'justify-center' : ''}`}>
          <HelpCircle size={17} className="shrink-0" />
          {!collapsed && <span>सहायता गाइड</span>}
        </a>
      </nav>

      {/* Logout */}
      <div className={`border-t border-gray-700 p-3
        ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`flex items-center gap-2 text-xs text-gray-400
            hover:text-white transition px-2 py-1.5 rounded-lg
            hover:bg-gray-800 w-full
            ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={15} className="shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── MOBILE: Overlay backdrop ────────────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: Drawer sidebar ──────────────────────────────────────── */}
      {isMobile && (
        <aside
          className={`fixed top-0 left-0 h-full z-50 bg-gray-900 text-white
            w-64 transition-transform duration-300 ease-in-out shadow-2xl
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white
              transition p-1.5 rounded-lg hover:bg-gray-800 z-10">
            <X size={20} />
          </button>
          <SidebarContent collapsed={false} />
        </aside>
      )}

      {/* ── DESKTOP: Static collapsible sidebar ────────────────────────── */}
      {!isMobile && (
        <aside
          className={`relative bg-gray-900 text-white flex flex-col shrink-0
            transition-all duration-300 ease-in-out
            ${desktopCollapsed ? 'w-14' : 'w-60'}`}>
          <SidebarContent collapsed={desktopCollapsed} />

          {/* Collapse toggle */}
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

      {/* ── Main content area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 px-4 py-3
            flex items-center gap-3 shrink-0 shadow-sm">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200
                transition text-gray-700">
              <Menu size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif font-bold text-gray-800 text-sm truncate">
                Prajatantr Ki Gunj
              </h1>
              <p className="text-xs text-gray-400">Employee Portal</p>
            </div>
            {/* Mini profile on top bar */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-700 truncate max-w-[100px]">
                  {user.fullName}
                </p>
                <p className="text-xs text-brand-500 font-mono">{user.employeeId}</p>
              </div>
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover
                    border-2 border-brand-500 shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-600
                  flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user.fullName?.[0] ?? 'E'}
                  </span>
                </div>
              )}
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