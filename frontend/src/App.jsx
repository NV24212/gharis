import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home.jsx';
import Weeks from './pages/Weeks.jsx';
import WeekDetail from './pages/WeekDetail.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import StudentManagement from './pages/admin/StudentManagement.jsx';
import WeekManagement from './pages/admin/WeekManagement.jsx';
import { useTranslation } from 'react-i18next';
import { logoUrl } from './data/site.js';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-brand-primary text-xl font-bold">{t('Ghars')}</span>
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            {user ? (
              <>
                {user.role === 'student' && <Link to="/dashboard" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Dashboard')}</Link>}
                {user.role === 'admin' && <Link to="/admin" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Admin Panel')}</Link>}
                <Link to="/weeks" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Weeks')}</Link>
                <Link to="/leaderboard" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Leaderboard')}</Link>
                <button onClick={handleLogout} className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Login')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-brand-border bg-brand-background">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-brand-secondary text-sm text-center">
      <p>جميع الحقوق محفوظة، مدرسة أوال الإعدادية للبنين <span className="font-sans" aria-hidden="true">&copy;</span> {new Date().getFullYear()}</p>
    </div>
  </footer>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return <main className="font-arabic">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col font-arabic">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const App = () => {
  const { user } = useContext(AuthContext); // This is now safe because App is a child of AuthProvider

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />

        {/* Protected Routes for Students */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/weeks/:id" element={<WeekDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="students" />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="weeks" element={<WeekManagement />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

export default App;