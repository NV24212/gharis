import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import { AuthContext } from './context/AuthContext';
import { CacheBusterProvider } from './context/CacheBusterContext.jsx';
import Home from './pages/Home.jsx';
import Weeks from './pages/Weeks.jsx';
import WeekDetail from './pages/WeekDetail.jsx';
import Login from './pages/Login.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminIndexRedirect from './pages/admin/AdminIndexRedirect.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import WeekManagement from './pages/admin/WeekManagement.jsx';
import PointsManagement from './pages/admin/PointsManagement.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import StudentLayout from './pages/student/StudentLayout.jsx';
import StudentPoints from './pages/student/StudentPoints.jsx';
import { logoUrl } from './data/site.js';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = (
    <>
      <Link to="/weeks" onClick={closeMenu} className="text-brand-secondary hover:text-brand-primary transition-colors block py-2">{t('Weeks')}</Link>
      <Link to="/leaderboard" onClick={closeMenu} className="text-brand-secondary hover:text-brand-primary transition-colors block py-2">{t('Leaderboard')}</Link>
      {user ? (
        <>
          {user.role === 'student' && <Link to="/dashboard" onClick={closeMenu} className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors block text-center mt-2">{t('Dashboard')}</Link>}
          {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors block text-center mt-2">{t('Admin Panel')}</Link>}
          <button onClick={handleLogout} className="text-brand-secondary hover:text-brand-primary transition-colors w-full text-right mt-2 block py-2">{t('Logout')}</button>
        </>
      ) : (
        <Link to="/login" onClick={closeMenu} className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors block text-center mt-2">{t('Login')}</Link>
      )}
    </>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
              <span className="text-brand-primary text-xl font-bold">{t('Ghars')}</span>
            </Link>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-5 text-sm font-medium">
              {navLinks}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-primary">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 right-0 left-0 bottom-0 z-30 bg-brand-background/95 backdrop-blur-xl animate-fade-in-down">
          <div className="px-6 py-4">
            {navLinks}
          </div>
        </div>
      )}
    </>
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
  const { t } = useTranslation();
  const isAppPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  useEffect(() => {
    const path = location.pathname;
    let title;

    const keyMap = {
      '/login': 'Login',
      '/weeks': 'Weeks',
      '/leaderboard': 'Leaderboard',
      '/dashboard': 'Dashboard',
      '/admin': 'Admin Panel',
    };

    if (path === '/') {
      title = 'مشروع غرس';
    } else {
      const pageKey = Object.keys(keyMap).find(key => path.startsWith(key));
      const pageName = pageKey ? t(keyMap[pageKey]) : t('Ghars');
      title = `غرس - ${pageName}`;
    }

    document.title = title;
  }, [location, t]);

  return (
    <div className="min-h-screen bg-brand-background text-brand-primary flex flex-col font-arabic">
      {!isAppPage && <Navigation />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isAppPage && <Footer />}
    </div>
  );
};

const App = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaMeasurementId) {
      ReactGA.initialize(gaMeasurementId);
    }
  }, []);

  return (
    <CacheBusterProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/weeks/:id" element={<WeekDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected Routes for Students */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<StudentLayout />}>
              <Route index element={<Navigate to="points" />} />
              <Route path="points" element={<StudentPoints />} />
            </Route>
          </Route>

          {/* Protected Routes for Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminIndexRedirect />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="weeks" element={<WeekManagement />} />
              <Route path="points" element={<PointsManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </CacheBusterProvider>
  );
};

export default App;