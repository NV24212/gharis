import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Video, ClipboardList, LogOut, PanelLeft, Menu, X } from 'lucide-react';
import { logoUrl } from '../../data/site.js';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Effect to handle closing sidebar on mobile when route changes or on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const navLinks = [
    { to: '/admin/students', text: t('admin.nav.students'), icon: Users },
    { to: '/admin/weeks', text: t('admin.nav.weeks'), icon: Video },
    { to: '/admin/classes', text: t('admin.nav.classes'), icon: ClipboardList },
  ];

  const navLinkClasses = (to) => {
    const isActive = location.pathname.startsWith(to);
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
    } ${!isSidebarOpen ? 'justify-center' : ''}`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center p-4 mb-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <div className={`flex items-center gap-3 transition-opacity duration-200 ${!isSidebarOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
          <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-xl font-bold whitespace-nowrap">{t('Ghars')}</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-brand-secondary hover:text-brand-primary hidden md:block">
          <PanelLeft className="h-6 w-6" />
        </button>
        <button onClick={() => setIsSidebarOpen(false)} className="text-brand-secondary hover:text-brand-primary md:hidden">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-grow px-2">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={navLinkClasses(link.to)} title={isSidebarOpen ? '' : link.text}>
                <link.icon className={`h-5 w-5 ${isSidebarOpen ? 'ml-3' : ''}`} />
                <span className={`transition-opacity duration-200 ${!isSidebarOpen ? 'hidden' : 'delay-200'}`}>{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-2 py-4 border-t border-brand-border">
        <button className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200 ${!isSidebarOpen ? 'justify-center' : ''}`}>
          <LogOut className={`h-5 w-5 ${isSidebarOpen ? 'ml-3' : ''}`} />
          <span className={`transition-opacity duration-200 ${!isSidebarOpen ? 'hidden' : 'delay-200'}`}>{t('Logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="flex h-screen bg-brand-background text-brand-primary font-arabic">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full bg-black/50 backdrop-blur-lg border-l border-brand-border z-40 transition-transform duration-300 md:relative md:translate-x-0 md:transition-all ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-20'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border p-4 flex items-center md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-brand-primary">
            <Menu size={24} />
          </button>
        </header>
        <div className="p-4 md:p-8 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;