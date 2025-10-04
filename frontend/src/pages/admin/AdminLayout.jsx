import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, BookOpen, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-content text-brand-primary'
        : 'text-brand-secondary hover:bg-brand-content hover:text-brand-primary'
    }`;

  return (
    <div className="flex h-screen bg-brand-background text-brand-primary font-arabic">
      {/* Sidebar - Stays on the left per design, but content is RTL */}
      <aside className="w-64 flex-shrink-0 border-l border-brand-border bg-brand-background p-4 flex flex-col">
        <div className="flex-grow">
          <h1 className="px-2 text-lg font-bold mb-6 text-brand-accent">{t('Ghars')}</h1>
          <nav className="flex flex-col space-y-2">
            <NavLink to="/admin/students" className={navLinkClasses}>
              <Users className="h-5 w-5" />
              <span>{t('Student Management')}</span>
            </NavLink>
            <NavLink to="/admin/weeks" className={navLinkClasses}>
              <BookOpen className="h-5 w-5" />
              <span>{t('Week Management')}</span>
            </NavLink>
          </nav>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-brand-secondary hover:bg-brand-content hover:text-brand-primary transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('Logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;