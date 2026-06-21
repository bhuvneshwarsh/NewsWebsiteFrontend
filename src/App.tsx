import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';

// Admin pages (lazy loaded)
const Dashboard     = lazy(() => import('./pages/admin/Dashboard'));
const ArticleList   = lazy(() => import('./pages/admin/ArticleList'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const MediaManager  = lazy(() => import('./pages/admin/MediaManager'));
const EPaperAdmin   = lazy(() => import('./pages/admin/EPaperAdmin'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login"  element={<Login />} />

            {/* Admin routes — protected inside AdminLayout */}
            <Route path="/admin"  element={<AdminLayout />}>
              <Route index                element={<Dashboard />} />
              <Route path="articles"      element={<ArticleList />} />
              <Route path="editor"        element={<ArticleEditor />} />
              <Route path="editor/:id"    element={<ArticleEditor />} />
              <Route path="media"         element={<MediaManager />} />
              <Route path="epaper"        element={<EPaperAdmin />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
