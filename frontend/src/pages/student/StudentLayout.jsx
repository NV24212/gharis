import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, LogOut, PanelLeft, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CacheBusterContext } from '../../context/CacheBusterContext.jsx';

const StudentLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cacheBuster } = useContext(CacheBusterContext);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard/points', text: t('student.nav.points'), icon: Star },
  ];

  const getNavLinkClasses = (isDesktop) => {
    const isOpen = isDesktop ? isDesktopSidebarOpen : true;
    return (to) => {
        const isActive = location.pathname.startsWith(to);
        return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
        } ${!isOpen ? 'justify-center' : ''}`;
    }
  };

  const SidebarContent = ({ isDesktop = false }) => {
    const isOpen = isDesktop ? isDesktopSidebarOpen : true;

    return (
        <div className="flex flex-col h-full">
            <div className={`flex items-center justify-between p-4 mb-4`}>
                <div className={`flex items-center gap-3 transition-all duration-300 ${!isOpen ? 'opacity-0 w-0 h-0' : 'opacity-100'}`}>
                    <span className="text-lg font-bold whitespace-nowrap">{user?.name}</span>
                </div>
                {!isDesktop && (
                    <button onClick={() => setIsMobileSidebarOpen(false)} className="text-brand-secondary hover:text-brand-primary">
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav className="flex-grow px-2">
                <ul className="space-y-2">
                {navLinks.map((link) => (
                    <li key={link.to}>
                    <NavLink to={link.to} className={getNavLinkClasses(isDesktop)(link.to)} title={isOpen ? '' : link.text}>
                        <link.icon className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{link.text}</span>
                    </NavLink>
                    </li>
                ))}
                </ul>
            </nav>

            <div className="px-2 py-4 mt-auto">
                <div className="border-t border-brand-border pt-4 space-y-2">
                    {isDesktop && (
                         <button onClick={() => setIsDesktopSidebarOpen(!isOpen)} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200 ${!isOpen ? 'justify-center' : ''}`}>
                            <PanelLeft className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                            <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('student.nav.toggleSidebar')}</span>
                        </button>
                    )}
                    <button onClick={handleLogout} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200 ${!isOpen ? 'justify-center' : ''}`}>
                        <LogOut className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                        <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('Logout')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div dir="rtl" className="flex h-screen bg-brand-background text-brand-primary font-arabic">
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <aside className={`fixed top-0 right-0 h-full w-64 bg-brand-background/90 backdrop-blur-xl border-l border-brand-border z-50 transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <aside className={`hidden md:flex md:flex-shrink-0 bg-black/20 border-l border-brand-border transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent isDesktop={true}/>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="sticky top-0 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border p-4 flex items-center md:hidden">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="text-brand-primary">
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8 animate-fade-in-up">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;