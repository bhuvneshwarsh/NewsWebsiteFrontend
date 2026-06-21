import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout  from './pages/admin/AdminLayout';

// Public pages
import Home            from './pages/public/Home';
import CategoryPage    from './pages/public/CategoryPages';
import ArticleDetail   from './pages/public/ArticleDetail';
import EPaperViewer    from './pages/public/EPaperViewer';
import NotFound        from './pages/public/NotFound';
import Login           from './pages/Login';

// Admin pages (lazy loaded — only downloaded when admin visits)
const Dashboard     = lazy(() => import('./pages/admin/Dashboard'));
const ArticleList   = lazy(() => import('./pages/admin/ArticleList'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const MediaManager  = lazy(() => import('./pages/admin/MediaManager'));
const EPaperAdmin   = lazy(() => import('./pages/admin/EPaperAdmin'));

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* ── Public routes ──────────────────────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route path="/"                 element={<Home />} />
              <Route path="/category/:slug"   element={<CategoryPage />} />
              <Route path="/news/:slug"       element={<ArticleDetail />} />
              <Route path="/epaper"           element={<EPaperViewer />} />
              <Route path="*"                 element={<NotFound />} />
            </Route>

            {/* ── Auth ───────────────────────────────────────────────────── */}
            <Route path="/login" element={<Login />} />

            {/* ── Admin routes (protected) ───────────────────────────────── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index              element={<Dashboard />} />
              <Route path="articles"    element={<ArticleList />} />
              <Route path="editor"      element={<ArticleEditor />} />
              <Route path="editor/:id"  element={<ArticleEditor />} />
              <Route path="media"       element={<MediaManager />} />
              <Route path="epaper"      element={<EPaperAdmin />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}