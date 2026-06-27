import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, ChevronDown,
  Users, Info, Phone, LogIn, HelpCircle
} from 'lucide-react';
import { categoriesApi, articlesApi } from '../../services/api';
import type { Category } from '../../types';

const MAX_VISIBLE_CATS = 5;

export default function Navbar() {
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const moreRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data.data));
    articlesApi.list({ size: 8 }).then(r =>
      setTickerItems(r.data.data.items.map((a: any) => a.title))
    );
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleCats  = categories.slice(0, MAX_VISIBLE_CATS);
  const overflowCats = categories.slice(MAX_VISIBLE_CATS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2.5 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap
    ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">

      {/* Breaking news ticker */}
      {tickerItems.length > 0 && (
        <div className="bg-brand-600 text-white text-xs overflow-hidden">
          <div className="container mx-auto px-4 flex items-center">
            <span className="bg-brand-800 font-bold uppercase px-3 py-1.5 shrink-0 tracking-wider">
              Breaking
            </span>
            <div className="overflow-hidden flex-1 py-1.5 pl-3">
              <div className="ticker-track whitespace-nowrap">
                {[...tickerItems, ...tickerItems].map((t, i) => (
                  <span key={i} className="mr-16 opacity-90">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-2">

          {/* Logo */}
          <Link to="/" className="font-serif text-xl font-bold text-gray-900 tracking-tight shrink-0">
            Prajatantr <span className="text-brand-600">Ki Gunj</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-hidden">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>

            {visibleCats.map(cat => (
              <NavLink key={cat.id} to={`/category/${cat.slug}`} className={navLinkClass}>
                {cat.name}
              </NavLink>
            ))}

            {/* More dropdown */}
            {overflowCats.length > 0 && (
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(o => !o)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm
                    font-medium transition
                    ${moreOpen ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
                  More
                  <ChevronDown size={14}
                    className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl
                    shadow-lg border border-gray-100 py-1 z-50">
                    {overflowCats.map(cat => (
                      <NavLink key={cat.id} to={`/category/${cat.slug}`}
                        onClick={() => setMoreOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm transition
                          ${isActive
                            ? 'text-brand-600 bg-brand-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600'}`}>
                        {cat.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}

            <NavLink to="/epaper" className={navLinkClass}>E-Paper</NavLink>
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <NavLink to="/team"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition
                ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
              <Users size={14} /> Our Team
            </NavLink>
            <NavLink to="/about"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition
                ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
              <Info size={14} /> About us
            </NavLink>
            <NavLink to="/contact"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition
                ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
              <Phone size={14} /> Contact us
            </NavLink>

            <button onClick={() => setSearchOpen(s => !s)}
              className="p-2 text-gray-500 hover:text-brand-600 transition rounded-md">
              <Search size={18} />
            </button>

            {/* ── Employee Login button ── */}
            <Link to="/employee-login"
              className="flex items-center gap-1.5 text-xs border border-gray-300
                hover:border-brand-400 text-gray-600 hover:text-brand-600
                px-3 py-1.5 rounded-md font-medium transition ml-1">
              <LogIn size={13} /> Staff Login
            </Link>

            {/* ── Admin button ── */}
            <Link to="/admin"
              className="flex items-center gap-1.5 text-xs bg-brand-600
                hover:bg-brand-700 text-white px-3 py-1.5 rounded-md font-medium
                transition ml-1">
              Admin Login
            </Link>
          </div>

          {/* Mobile icons */}
          <div className="flex lg:hidden items-center gap-1">
            <button onClick={() => setSearchOpen(s => !s)}
              className="p-2 text-gray-500 hover:text-brand-600 transition">
              <Search size={18} />
            </button>
            <button onClick={() => setMenuOpen(o => !o)}
              className="p-2 text-gray-500 hover:text-brand-600 transition">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 border-t border-gray-100 pt-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input autoFocus value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <button type="submit"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm
                  font-medium hover:bg-brand-700 transition">
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3
          space-y-0.5 max-h-[80vh] overflow-y-auto">
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            Home
          </Link>

          <div className="pt-1 pb-1">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Categories
            </p>
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2 space-y-0.5">
            <Link to="/epaper" onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              E-Paper
            </Link>
            <Link to="/team" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              <Users size={14} /> Our Team
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              <Info size={14} /> About us
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              <Phone size={14} /> Contact us
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-2 space-y-0.5">
            {/* Employee Login in mobile */}
            <Link to="/employee-login" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-brand-600
                hover:bg-brand-50 rounded-lg font-medium">
              <LogIn size={14} /> Staff Login
            </Link>
            {/* Employee Guide in mobile */}
            <Link to="/employee-guide" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600
                hover:bg-gray-50 rounded-lg">
              <HelpCircle size={14} /> Staff Help Guide (हिंदी)
            </Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold
                text-brand-600 hover:bg-brand-50 rounded-lg">
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
