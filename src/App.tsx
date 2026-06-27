import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout   from './components/layout/PublicLayout';
import AdminLayout    from './pages/admin/AdminLayout';
import EmployeeLayout from './pages/employee/EmployeeLayout';

// Public pages
import Home            from './pages/public/Home';
import CategoryPage    from './pages/public/CategoryPages';
import ArticleDetail   from './pages/public/ArticleDetail';
import EPaperViewer    from './pages/public/EPaperViewer';
import TeamPage        from './pages/public/TeamPage';
import EmployeeProfile from './pages/public/EmployeeProfile';
import AboutUs         from './pages/public/AboutUs';
import ContactUs       from './pages/public/ContactUs';
import NotFound        from './pages/public/NotFound';

// Auth pages
import Login         from './pages/Login';
import EmployeeLogin from './pages/EmployeeLogin';

// Employee pages
import EmployeeDashboard     from './pages/employee/EmployeeDashboard';
import EmployeeArticleEditor from './pages/employee/EmployeeArticleEditor';
import ChangePassword        from './pages/employee/ChangePassword';

// Admin pages (lazy)
const Dashboard   = lazy(() => import('./pages/admin/Dashboard'));
const ArticleList = lazy(() => import('./pages/admin/ArticleList'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const MediaManager  = lazy(() => import('./pages/admin/MediaManager'));
const EPaperAdmin   = lazy(() => import('./pages/admin/EPaperAdmin'));
const TeamManager   = lazy(() => import('./pages/admin/TeamManager'));

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
              <Route path="/"               element={<Home />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/news/:slug"     element={<ArticleDetail />} />
              <Route path="/epaper"         element={<EPaperViewer />} />
              <Route path="/team"           element={<TeamPage />} />
              <Route path="/about"          element={<AboutUs />} />
              <Route path="/contact"        element={<ContactUs />} />
              <Route path="*"               element={<NotFound />} />
            </Route>

            {/* ── Employee profile (standalone — QR scan target) ──────────── */}
            <Route path="/team/:employeeId" element={<EmployeeProfile />} />

            {/* ── Auth ───────────────────────────────────────────────────── */}
            <Route path="/login"          element={<Login />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />

            {/* ── Employee portal (restricted) ────────────────────────────── */}
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route index                    element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard"         element={<EmployeeDashboard />} />
              <Route path="editor"            element={<EmployeeArticleEditor />} />
              <Route path="editor/:id"        element={<EmployeeArticleEditor />} />
              <Route path="change-password"   element={<ChangePassword />} />
            </Route>

            {/* ── Admin routes (SuperAdmin / Admin / Reporter) ─────────────── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index             element={<Dashboard />} />
              <Route path="articles"   element={<ArticleList />} />
              <Route path="editor"     element={<ArticleEditor />} />
              <Route path="editor/:id" element={<ArticleEditor />} />
              <Route path="media"      element={<MediaManager />} />
              <Route path="epaper"     element={<EPaperAdmin />} />
              <Route path="team"       element={<TeamManager />} />
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
