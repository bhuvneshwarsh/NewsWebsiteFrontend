import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Newspaper } from 'lucide-react';
import { categoriesApi, articlesApi } from '../../services/api';
import type { Category } from '../../types';

export default function Navbar() {
  const [categories,   setCategories]   = useState<Category[]>([]);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [tickerItems,  setTickerItems]  = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data.data));
    articlesApi.list({ size: 6 }).then(r =>
      setTickerItems(r.data.data.items.map((a: any) => a.title))
    );
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Breaking news ticker */}
      {tickerItems.length > 0 && (
        <div className="bg-brand-600 text-white text-xs overflow-hidden">
          <div className="container mx-auto px-4 flex items-center gap-0">
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
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
            Prajatantr <span className="text-brand-600">Ki Gunj</span>
          </Link>

          {/* Desktop category nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition
                ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
              Home
            </NavLink>
            {categories.map(cat => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition
                  ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
                {cat.name}
              </NavLink>
            ))}
            <NavLink to="/epaper"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition
                ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}>
              E-Paper
            </NavLink>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(s => !s)}
              className="p-2 text-gray-500 hover:text-brand-600 transition rounded-md">
              <Search size={18} />
            </button>
            <Link to="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-md font-medium transition">
              <Newspaper size={13} /> Admin
            </Link>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 text-gray-500 hover:text-brand-600 transition">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 border-t border-gray-100 pt-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button type="submit"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition">
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              {cat.name}
            </Link>
          ))}
          <Link to="/epaper" onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">E-Paper</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg">Admin Panel</Link>
        </div>
      )}
    </header>
  );
}