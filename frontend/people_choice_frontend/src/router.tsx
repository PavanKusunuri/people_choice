import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import useAuth from './hooks/useAuth';

// Layout components
const MainLayout = lazy(() => import('./components/layout/MainLayout'));

// Pages
const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/auth/Login'));
const RegisterPage = lazy(() => import('./pages/auth/Register'));
const BrowsePage = lazy(() => import('./pages/Browse'));
const TitleDetailPage = lazy(() => import('./pages/TitleDetail'));
const PersonDetailPage = lazy(() => import('./pages/PersonDetail'));
const SearchPage = lazy(() => import('./pages/Search'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const AdminPage = lazy(() => import('./pages/admin/Admin'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl text-gray-400">Loading...</div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ 
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'user' | 'critic' | 'admin';
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main layout routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/:type/:slug" element={<TitleDetailPage />} />
            <Route path="/person/:slug" element={<PersonDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default Router;
