import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Video, ClipboardList, LogOut } from 'lucide-react';
import { logoUrl } from '../../data/site.js';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { to: '/admin/students', text: t('admin.nav.students'), icon: Users },
    { to: '/admin/weeks', text: t('admin.nav.weeks'), icon: Video },
    { to: '/admin/classes', text: t('admin.nav.classes'), icon: ClipboardList },
  ];

  const navLinkClasses = (to) => {
    const isActive = location.pathname.startsWith(to);
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-primary/10 text-brand-primary'
        : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
    }`;
  };

  return (
    <div dir="rtl" className="flex h-screen bg-brand-background text-brand-primary font-arabic">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-l border-brand-border bg-black/20 p-4 flex flex-col">
        <div className="flex items-center gap-3 px-2 mb-8">
          <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-xl font-bold">{t('Ghars')}</span>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClasses(link.to)}>
                  <link.icon className="ml-3 h-5 w-5" />
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
           {/* Placeholder for future logout button */}
           <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200">
             <LogOut className="ml-3 h-5 w-5" />
             {t('Logout')}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;