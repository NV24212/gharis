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
import { logoUrl } from './data/site.js';

// Navigation component that consumes the AuthContext
const Navigation = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-gray-700">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-contain ring-1 ring-white/10 group-hover:ring-white/25 transition" />
            <span className="text-white text-lg font-bold">Ghars</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                {user.role === 'student' && <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>}
                {user.role === 'admin' && <Link to="/admin" className="hover:text-white transition">Admin Panel</Link>}
                <Link to="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
                <button onClick={logout} className="hover:text-white transition">Logout</button>
              </>
            ) : (
              <>
                <a href="/#about" className="hover:text-white transition">About Ghars</a>
                <Link to="/login" className="hover:text-white transition">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="mt-8 border-t border-brand-gray/30 bg-black/60">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-white text-sm text-center">
      <p>جميع الحقوق محفوظة، مدرسة أوال الاإعدادية للبنين <span className="font-sans" aria-hidden="true">&copy;</span> {new Date().getFullYear()}</p>
    </div>
  </footer>
);

// Main Layout component
const Layout = ({ children }) => {
  const location = useLocation();
  // Do not show the main nav/footer on admin pages, as it has its own layout
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
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