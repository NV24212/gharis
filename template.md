# UI Component Templates

This file provides templates for the UI components used in this application.

## Dialogs

### Modal

This is a reusable `Modal` component that can be used to display any content in a dialog box.

**Code:**

```jsx
import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-3xl' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-brand-background border border-brand-border rounded-20 shadow-card w-full ${maxWidth} m-auto flex flex-col max-h-[90vh] animate-modal-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-brand-border">
          <h2 className="text-xl font-bold text-brand-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-brand-secondary hover:text-brand-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

**Usage:**

```jsx
import React, { useState } from 'react';
import Modal from './Modal';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="My Modal"
      >
        <p>This is the content of the modal.</p>
      </Modal>
    </div>
  );
};
```

### Confirmation Modal

This component builds on the `Modal` component to create a confirmation dialog.

**Code:**

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="text-brand-secondary flex flex-col items-center text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
```

**Usage:**

```jsx
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    // Handle the delete logic here
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Delete Item</button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
};
```

## Cards

### Section

This component is used to create a styled section with a title and subtitle.

**Code:**

```jsx
import React from 'react'

export default function Section({ id, title, children, subtitle }) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-20 border border-brand-gray/30 bg-black/40 shadow-card shadow-black/60 backdrop-blur-[2px]">
        <div className="p-6 sm:p-10">
          {title && (
            <header className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">{title}</h2>
              {subtitle && <p className="mt-2 text-brand-gray">{subtitle}</p>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
```

**Usage:**

```jsx
import React from 'react';
import Section from './Section';

const MyComponent = () => {
  return (
    <Section title="My Section" subtitle="This is a subtitle.">
      <p>This is the content of the section.</p>
    </Section>
  );
};
```

### Admin Card

This component is used to display a card with admin information and actions.

**Code:**

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';

const AdminCard = ({ admin, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-bold text-brand-primary flex-1 min-w-0 break-words">{admin.name}</h3>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => onEdit(admin)} className="text-brand-secondary hover:text-brand-primary transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(admin.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
```

**Usage:**

```jsx
import React from 'react';
import AdminCard from './AdminCard';

const MyComponent = () => {
  const admin = { id: 1, name: 'John Doe' };

  const handleEdit = (admin) => {
    // Handle edit logic
  };

  const handleDelete = (id) => {
    // Handle delete logic
  };

  return (
    <AdminCard admin={admin} onEdit={handleEdit} onDelete={handleDelete} />
  );
};
```

## Layout

### Admin Layout with Sidebar

This component provides a layout for the admin panel, including a collapsible sidebar.

**Dependencies:**

*   This component has a dependency on the `MobileAdminSidebar` component, which is provided below.
*   This component relies on `react-router-dom` for routing, `lucide-react` for icons, and a custom `AuthContext` for user data and logout functionality.
*   The styling is based on a custom Tailwind CSS configuration. You will need to define the `brand` colors and other custom styles in your `tailwind.config.js` file.

**MobileAdminSidebar Code:**

```jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Home, LogOut } from 'lucide-react';
import { logoUrl } from '../../data/site.js';

const MobileAdminSidebar = ({ isOpen, onClose, user, navLinks, handleLogout }) => {
  const { t } = useTranslation();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-black/50 backdrop-blur-lg border-l border-brand-border z-50 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ willChange: 'transform' }} // Animation optimization
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 mb-4 border-b border-brand-border/50">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-lg font-bold whitespace-nowrap">{user?.name}</span>
            </div>
            <button onClick={onClose} className="text-brand-secondary hover:text-brand-primary">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-grow px-2">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary"
                  onClick={handleLinkClick}
                >
                  <Home className="h-5 w-5 ml-3" />
                  <span>{t('admin.nav.home')}</span>
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
                      }`
                    }
                    onClick={handleLinkClick}
                  >
                    <link.icon className="h-5 w-5 ml-3" />
                    <span>{link.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-2 py-4 mt-auto">
            <div className="border-t border-brand-border pt-4">
              <button
                onClick={() => {
                  handleLinkClick();
                  handleLogout();
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 ml-3" />
                <span>{t('Logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileAdminSidebar;
```

**Code:**

```jsx
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Video, Star, LogOut, PanelLeft, Menu, Home, BarChart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import MobileAdminSidebar from './MobileAdminSidebar.jsx';
import { logoUrl } from '../../data/site.js';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change as a fail-safe
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/users', text: t('admin.nav.users'), icon: Users, show: user?.can_manage_students || user?.can_manage_admins || user?.can_manage_classes },
    { to: '/admin/weeks', text: t('admin.nav.weeks'), icon: Video, show: user?.can_manage_weeks },
    { to: '/admin/points', text: t('admin.nav.points'), icon: Star, show: user?.can_manage_points },
    { to: '/admin/analytics', text: t('admin.nav.analytics'), icon: BarChart, show: user?.can_view_analytics },
  ].filter(link => link.show);

  const getNavLinkClasses = (isOpen) => (to) => {
    const isActive = location.pathname === to;
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
    } ${!isOpen ? 'justify-center' : ''}`;
  };

  const getHomeLinkClasses = (isOpen) => `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary ${!isOpen ? 'justify-center' : ''}`;

  const DesktopSidebarContent = () => {
    const isOpen = isDesktopSidebarOpen;

    return (
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between p-4 mb-4 border-b border-brand-border/50`}>
          <div className={`flex items-center gap-3 transition-all duration-300 ${!isOpen ? 'opacity-0 w-0 h-0' : 'opacity-100'}`}>
            <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-bold whitespace-nowrap">{user?.name}</span>
          </div>
        </div>

        <nav className="flex-grow px-2">
          <ul className="space-y-2">
            <li>
              <Link to="/" className={getHomeLinkClasses(isOpen)} title={isOpen ? '' : t('admin.nav.home')}>
                <Home className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('admin.nav.home')}</span>
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={getNavLinkClasses(isOpen)(link.to)} title={isOpen ? '' : link.text}>
                  <link.icon className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                  <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-2 py-4 mt-auto">
          <div className="border-t border-brand-border pt-4 space-y-2">
            <button onClick={() => setIsDesktopSidebarOpen(!isOpen)} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200 ${!isOpen ? 'justify-center' : ''}`}>
              <PanelLeft className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
              <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('student.nav.toggleSidebar')}</span>
            </button>
            <button onClick={handleLogout} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200 ${!isOpen ? 'justify-center' : ''}`}>
              <LogOut className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
              <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('Logout')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div dir="rtl" className="flex h-screen bg-brand-background text-brand-primary font-arabic">
      <MobileAdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        user={user}
        navLinks={navLinks}
        handleLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:flex-shrink-0 bg-black/20 border-l border-brand-border transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64' : 'w-20'}`}>
        <DesktopSidebarContent />
      </aside>

      {/* Main Content */}
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

export default AdminLayout;
```
