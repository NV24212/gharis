# Admin Panel UI Components

This file contains the consolidated code for the UI components and styling of the admin panel.

---

### `frontend/src/components/ConfirmationModal.jsx`

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
            {t('common.cancel\)}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('common.delete\)}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
```


---

### `frontend/src/components/LoadingScreen.jsx`

```jsx
import React from 'react';
import { logoUrl } from '../data/site';

const LoadingScreen = ({ fullScreen = true }) => {
  const wrapperClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-brand-background z-50'
    : 'flex items-center justify-center py-20';

  return (
    <div className={wrapperClasses}>
      <div className="flex flex-col items-center gap-4">
        <img
          src={logoUrl}
          alt="Loading..."
          className="h-16 w-16 rounded-full object-cover animate-pulse-subtle"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
```


---

### `frontend/src/components/Modal.jsx`

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


---

### `frontend/src/components/PasswordInput.jsx`

```jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        className={`w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 left-0 flex items-center px-3 text-brand-secondary hover:text-brand-primary"
        aria-label="Toggle password visibility"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
```


---

### `frontend/src/components/ProtectedRoute.jsx`

```jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    // This case should ideally not be reached if isLoading is false and there's a token,
    // but as a fallback, redirect to login.
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect if the user's role is not allowed
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```


---

### `frontend/src/components/Section.jsx`

```jsx
import React from 'react';

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


---

### `frontend/src/pages/admin/AdminCard.jsx`

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


---

### `frontend/src/pages/admin/AdminIndexRedirect.jsx`

```jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';

const AdminIndexRedirect = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen fullScreen={false} />;
  }

  if (user) {
    // Check permissions in a specific order and redirect to the first available page
    if (user.can_manage_students || user.can_manage_admins || user.can_manage_classes) {
      return <Navigate to="/admin/users" replace />;
    }
    if (user.can_manage_weeks) {
      return <Navigate to="/admin/weeks" replace />;
    }
    if (user.can_manage_points) {
      return <Navigate to="/admin/points" replace />;
    }
  }

  // Fallback for an admin who has no permissions or if user object is not available
  return <Navigate to="/login" replace />;
};

export default AdminIndexRedirect;
```


---

### `frontend/src/pages/admin/AdminLayout.jsx`

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

---

### `frontend/src/pages/admin/MobileAdminSidebar.jsx`

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

---

### `frontend/src/pages/admin/PointsManagement.jsx`

```jsx
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CacheBusterContext } from '../../context/CacheBusterContext';
import api, { classService } from '../../services/api';
import { Loader2, PlusCircle, MinusCircle, Search, ChevronDown } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import PointsStudentCard from './PointsStudentCard';

const PointsManagement = () => {
  const { t } = useTranslation();
  const { bustCache } = useContext(CacheBusterContext);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState('add'); // 'add' or 'deduct'
  const [points, setPoints] = useState('');

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/admin/students'),
        classService.getAllClasses(),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes);
    } catch (err) {
      setError(t('pointsManagement.errors.fetchStudents'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    return students
      .filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(student => {
        if (!classFilter) return true;
        return student.class_id === parseInt(classFilter);
      });
  }, [students, searchTerm, classFilter]);

  const openModal = (student, type) => {
    setSelectedStudent(student);
    setActionType(type);
    setIsModalOpen(true);
    setPoints('');
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    if (!points || !selectedStudent) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const pointsValue = actionType === 'deduct' ? -Math.abs(Number(points)) : Math.abs(Number(points));

    try {
      await api.post(`/admin/students/${selectedStudent.id}/add-points`, { points: pointsValue });
      const successMessage = actionType === 'add'
        ? t('pointsManagement.success.add', { points: pointsValue, studentName: selectedStudent.name })
        : t('pointsManagement.success.deduct', { points: Math.abs(pointsValue), studentName: selectedStudent.name });

      setSuccess(successMessage);

      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === selectedStudent.id
            ? { ...student, points: student.points + pointsValue }
            : student
        )
      );

      bustCache();
      closeModal();
    } catch (err) {
      setError(t('pointsManagement.errors.addPoints'));
      console.error(err);
      fetchStudents(); // Re-fetch on error to ensure data consistency
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen fullScreen={false} />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('pointsManagement.title')}</h1>
        <div className="flex items-center gap-4">
            <div className="relative">
                <label htmlFor="classFilter" className="sr-only">{t('userManagement.filterByClass')}</label>
                <select
                id="classFilter"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-black/30 border border-brand-border text-brand-primary p-3 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none"
                >
                <option value="">{t('userManagement.allClasses')}</option>
                {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
                    <ChevronDown className="h-5 w-5 text-brand-secondary" />
                </div>
            </div>
            <div className="relative w-full max-w-xs">
                <input
                    type="text"
                    placeholder={t('pointsManagement.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-brand-secondary" />
                </div>
            </div>
        </div>
      </div>

      {error && !isModalOpen && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-6">{success}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <PointsStudentCard
            key={student.id}
            student={student}
            onAdd={(s) => openModal(s, 'add')}
            onDeduct={(s) => openModal(s, 'deduct')}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${t(actionType === 'add' ? 'pointsManagement.add' : 'pointsManagement.deduct')} ${t('pointsManagement.titleFor')} ${selectedStudent?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePointsSubmit} className="space-y-4">
          {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-brand-secondary mb-2">
              {t('pointsManagement.pointsTo', { context: actionType })}
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="submit"
              className={`font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center w-28 ${actionType === 'add' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.confirm')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PointsManagement;
```

---

### `frontend/src/pages/admin/PointsStudentCard.jsx`

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, MinusCircle, Star, BookOpen } from 'lucide-react';

const PointsStudentCard = ({ student, onAdd, onDeduct }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div>
        <h3 className="text-lg font-bold text-brand-primary min-w-0 break-words">{student.name}</h3>
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-secondary">
            <BookOpen size={14} />
            <span>{student.class?.name || <span className="italic">{t('studentManagement.form.unassigned')}</span>}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-secondary">
            <Star size={14} />
            <span>{t('studentManagement.table.points')}: {student.points}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-brand-border/50 pt-4">
        <button
          onClick={() => onAdd(student)}
          className="flex-1 flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-green-500/10 hover:bg-green-500/20 rounded-lg py-2 text-sm font-semibold"
        >
          <PlusCircle size={18} />
          <span>{t('pointsManagement.add')}</span>
        </button>
        <button
          onClick={() => onDeduct(student)}
          className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 hover:bg-red-500/20 rounded-lg py-2 text-sm font-semibold"
        >
          <MinusCircle size={18} />
          <span>{t('pointsManagement.deduct')}</span>
        </button>
      </div>
    </div>
  );
};

export default PointsStudentCard;
```

---

### `frontend/src/pages/admin/StudentCard.jsx`

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Star, BookOpen } from 'lucide-react';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-brand-primary flex-1 min-w-0 break-words">{student.name}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(student)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(student.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-secondary">
            <BookOpen size={14} />
            <span>{student.class?.name || <span className="italic">{t('studentManagement.form.unassigned')}</span>}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-secondary">
            <Star size={14} />
            <span>{t('studentManagement.table.points')}: {student.points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
```

---

### `frontend/src/pages/admin/UserManagement.jsx`

```jsx
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api, { classService, adminService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Loader2, ChevronDown, Users, Shield, BookCopy } from 'lucide-react';
import { logoUrl } from '../../data/site.js';
import Modal from '../../components/Modal';
import StudentCard from './StudentCard';
import AdminCard from './AdminCard';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';
import PasswordInput from '../../components/PasswordInput';

const UserManagement = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const availableTabs = useMemo(() => {
    const tabs = [];
    if (user?.can_manage_students) tabs.push({ id: 'students', label: t('userManagement.tabs.students'), icon: Users });
    if (user?.can_manage_admins) tabs.push({ id: 'admins', label: t('userManagement.tabs.admins'), icon: Shield });
    if (user?.can_manage_classes) tabs.push({ id: 'classes', label: t('userManagement.tabs.classes'), icon: BookCopy });
    return tabs;
  }, [user, t]);

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || '');

  // Common State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Students State
  const [students, setStudents] = useState([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentFormData, setStudentFormData] = useState({ name: '', password: '', class_id: '' });
  const [isStudentConfirmModalOpen, setIsStudentConfirmModalOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [classFilter, setClassFilter] = useState('');

  // Admins State
  const [admins, setAdmins] = useState([]);
  const [isAdminsLoading, setIsAdminsLoading] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    password: '',
    can_manage_admins: true,
    can_manage_classes: true,
    can_manage_students: true,
    can_manage_weeks: true,
    can_manage_points: true,
    can_view_analytics: false,
  });
  const [isAdminsConfirmModalOpen, setIsAdminsConfirmModalOpen] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState(null);

  // Classes State
  const [classes, setClasses] = useState([]);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classFormData, setClassFormData] = useState({ name: "" });
  const [isClassConfirmModalOpen, setIsClassConfirmModalOpen] = useState(false);
  const [deletingClassId, setDeletingClassId] = useState(null);

  const filteredStudents = useMemo(() => {
    if (!classFilter) return students;
    return students.filter(student => student.class?.id === parseInt(classFilter));
  }, [students, classFilter]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/admin/students'),
        classService.getAllClasses(),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes);
      setError('');
    } catch (err) {
      setError(t('userManagement.errors.fetchInitialData'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchStudents = useCallback(async () => {
    try {
      const studentsRes = await api.get('/admin/students');
      setStudents(studentsRes.data);
    } catch (err) {
      setError(t('studentManagement.errors.fetch'));
      console.error(err);
    }
  }, [t]);

  const fetchAdminsData = useCallback(async () => {
    setIsAdminsLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      setError(t('userManagement.errors.fetchAdmins'));
      console.error(err);
    } finally {
      setIsAdminsLoading(false);
    }
  }, [t]);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      setError(t("classManagement.errors.fetch"));
      console.error(err);
    }
  }, [t]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (activeTab === 'admins' && admins.length === 0) {
      fetchAdminsData();
    }
  }, [activeTab, admins.length, fetchAdminsData]);

  // Student Modal and Form Handlers
  const openStudentModal = async (student = null) => {
    if (student) {
      // In a real app, you'd fetch this securely. Here, we're just getting it.
      const response = await api.get(`/admin/students/${student.id}`);
      setEditingStudent(response.data);
      setStudentFormData({ name: response.data.name, password: response.data.password, class_id: response.data.class?.id || '' });
    } else {
      setEditingStudent(null);
      setStudentFormData({ name: '', password: '', class_id: '' });
    }
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleStudentFormChange = (e) => {
    setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
  };

  const handleStudentFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errorKey = editingStudent ? 'studentManagement.errors.update' : 'studentManagement.errors.add';
    try {
      let payload = { ...studentFormData, class_id: studentFormData.class_id ? Number(studentFormData.class_id) : null };
      if (editingStudent) {
        // Update student text data
        if (!payload.password) delete payload.password;
        await api.put(`/admin/students/${editingStudent.id}`, payload);
      } else {
        // Create new student
        if (!payload.password) {
          setError(t('studentManagement.errors.passwordRequired'));
          setIsSubmitting(false);
          return;
        }
        await api.post('/admin/students', payload);
      }
      await fetchStudents();
      closeStudentModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAdminDeleteConfirm = (id) => {
    setDeletingAdminId(id);
    setIsAdminsConfirmModalOpen(true);
  };

  const handleAdminConfirmDelete = () => {
    if (!deletingAdminId) return;
    setIsAdminsConfirmModalOpen(false);
    setAdmins(prev => prev.map(a => a.id === deletingAdminId ? { ...a, deleting: true } : a));
    setTimeout(async () => {
      try {
        // Assuming adminService will have a deleteAdmin method
        await adminService.deleteAdmin(deletingAdminId);
        setAdmins(prev => prev.filter(a => a.id !== deletingAdminId));
      } catch (err) {
        setError(t('userManagement.errors.deleteAdmin'));
        console.error(err);
        await fetchAdminsData();
      } finally {
        setDeletingAdminId(null);
      }
    }, 300);
  };

  const openStudentDeleteConfirm = (id) => {
    setDeletingStudentId(id);
    setIsStudentConfirmModalOpen(true);
  };

  const handleStudentConfirmDelete = () => {
    if (!deletingStudentId) return;
    setIsStudentConfirmModalOpen(false);
    setStudents(prev => prev.map(s => s.id === deletingStudentId ? { ...s, deleting: true } : s));
    setTimeout(async () => {
      try {
        await api.delete(`/admin/students/${deletingStudentId}`);
        setStudents(prev => prev.filter(s => s.id !== deletingStudentId));
      } catch (err) {
        setError(t('studentManagement.errors.delete'));
        console.error(err);
        await fetchStudents();
      } finally {
        setDeletingStudentId(null);
      }
    }, 300);
  };

  // Admin Modal and Form Handlers
  const openAdminModal = async (admin = null) => {
    if (admin) {
      const response = await api.get(`/admin/admins/${admin.id}`);
      setEditingAdmin(response.data);
      setAdminFormData({
        name: response.data.name,
        password: response.data.password,
        can_manage_admins: response.data.can_manage_admins,
        can_manage_classes: response.data.can_manage_classes,
        can_manage_students: response.data.can_manage_students,
        can_manage_weeks: response.data.can_manage_weeks,
        can_manage_points: response.data.can_manage_points,
        can_view_analytics: response.data.can_view_analytics,
      });
    } else {
      setEditingAdmin(null);
      setAdminFormData({
        name: '',
        password: '',
        can_manage_admins: true,
        can_manage_classes: true,
        can_manage_students: true,
        can_manage_weeks: true,
        can_manage_points: true,
        can_view_analytics: false,
      });
    }
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setEditingAdmin(null);
  };

  const handleAdminFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const errorKey = editingAdmin ? 'userManagement.errors.updateAdmin' : 'userManagement.errors.createAdmin';
    try {
      let payload = { ...adminFormData };
      if (editingAdmin) {
        if (!payload.password) delete payload.password;
        await adminService.updateAdmin(editingAdmin.id, payload);
      } else {
         if (!payload.password) {
          setError(t('userManagement.errors.passwordRequired'));
          setIsSubmitting(false);
          return;
        }
        await adminService.createAdmin(payload);
      }
      await fetchAdminsData();
      closeAdminModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Class Modal and Form Handlers
  const openClassModal = (cls = null) => {
    setEditingClass(cls);
    setClassFormData(cls ? { name: cls.name } : { name: "" });
    setIsClassModalOpen(true);
  };

  const closeClassModal = () => {
    setIsClassModalOpen(false);
    setEditingClass(null);
  };

  const handleClassFormChange = (e) => {
    setClassFormData({ ...classFormData, [e.target.name]: e.target.value });
  };

  const handleClassFormSubmit = async (e) => {
    e.preventDefault();
    if (!classFormData.name.trim()) return;
    setIsSubmitting(true);
    const errorKey = editingClass ? "classManagement.errors.update" : "classManagement.errors.add";
    try {
      if (editingClass) {
        await api.put(`/admin/classes/${editingClass.id}`, classFormData);
      } else {
        await classService.createClass(classFormData);
      }
      await fetchClasses();
      closeClassModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openClassDeleteConfirm = (classId) => {
    setDeletingClassId(classId);
    setIsClassConfirmModalOpen(true);
  };

  const handleClassConfirmDelete = () => {
    if (!deletingClassId) return;
    setIsClassConfirmModalOpen(false);
    setClasses(prev => prev.map(c => c.id === deletingClassId ? { ...c, deleting: true } : c));
    setTimeout(async () => {
      try {
        await classService.deleteClass(deletingClassId);
        setClasses(prev => prev.filter(c => c.id !== deletingClassId));
      } catch (err) {
        setError(t("classManagement.errors.delete"));
        console.error(err);
        await fetchClasses();
      } finally {
        setDeletingClassId(null);
      }
    }, 300);
  };

  const renderStudentsTab = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-brand-primary">{t('userManagement.tabs.students')}</h2>
          <div className="relative">
            <label htmlFor="classFilter" className="sr-only">{t('userManagement.filterByClass')}</label>
            <select
              id="classFilter"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-black/30 border border-brand-border text-brand-primary p-2.5 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none text-sm"
            >
              <option value="">{t('userManagement.allClasses')}</option>
              {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
              <ChevronDown className="h-4 w-4 text-brand-secondary" />
            </div>
          </div>
        </div>
        <button
          onClick={() => openStudentModal()}
          className="flex items-center justify-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('studentManagement.addStudent')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={openStudentModal}
            onDelete={openStudentDeleteConfirm}
          />
        ))}
      </div>
    </>
  );

  const renderAdminsTab = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-brand-primary">{t('userManagement.tabs.admins')}</h2>
        <button
          onClick={() => openAdminModal()}
          className="flex items-center justify-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('userManagement.addAdmin')}
        </button>
      </div>
      {isAdminsLoading ? (
        <LoadingScreen fullScreen={false} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {admins.map((admin) => (
            <AdminCard
              key={admin.id}
              admin={admin}
              onEdit={openAdminModal}
              onDelete={openAdminDeleteConfirm}
            />
          ))}
        </div>
      )}
    </>
  );

  const renderClassesTab = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-brand-primary">{t("classManagement.title")}</h2>
        <button
          onClick={() => openClassModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t("classManagement.addClass")}
        </button>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className={`bg-black/20 border border-brand-border rounded-20 p-5 flex justify-between items-center transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1 ${cls.deleting ? 'animate-fade-out' : ''}`}
            >
              <span className="text-lg font-semibold">{cls.name}</span>
              <div className="flex gap-3">
                <button onClick={() => openClassModal(cls)} className="text-brand-secondary hover:text-brand-primary transition-colors"><Edit size={20} /></button>
                <button onClick={() => openClassDeleteConfirm(cls.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
    </>
  );

  if (loading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-primary mb-8">{t('userManagement.title')}</h1>
      <div className="flex border-b border-brand-border mb-8">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-brand-secondary hover:text-brand-primary'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}
      <div>
        {activeTab === 'students' && user?.can_manage_students && renderStudentsTab()}
        {activeTab === 'admins' && user?.can_manage_admins && renderAdminsTab()}
        {activeTab === 'classes' && user?.can_manage_classes && renderClassesTab()}
      </div>

      {/* Student Modal */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={closeStudentModal}
        title={editingStudent ? t('studentManagement.editStudent') : t('studentManagement.addStudent')}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleStudentFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-secondary mb-2">{t('studentManagement.form.name')}</label>
            <input type="text" id="name" name="name" value={studentFormData.name} onChange={handleStudentFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-secondary mb-2">{t('studentManagement.form.password')}</label>
            <PasswordInput id="password" name="password" value={studentFormData.password} onChange={handleStudentFormChange} required />
          </div>
          <div className="relative">
            <label htmlFor="class_id" className="block text-sm font-medium text-brand-secondary mb-2">{t('studentManagement.table.class')}</label>
            <select id="class_id" name="class_id" value={studentFormData.class_id} onChange={handleStudentFormChange} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none">
              <option value="">{t('studentManagement.form.selectClass')}</option>
              {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 pt-8">
              <ChevronDown className="h-5 w-5 text-brand-secondary" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeStudentModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Admin Modal */}
      <Modal
        isOpen={isAdminModalOpen}
        onClose={closeAdminModal}
        title={editingAdmin ? t('userManagement.editAdmin') : t('userManagement.addAdmin')}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAdminFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-name" className="block text-sm font-bold text-brand-secondary mb-2">{t('userManagement.adminForm.name')}</label>
            <input type="text" id="admin-name" name="name" value={adminFormData.name} onChange={handleAdminFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-bold text-brand-secondary mb-2">{t('userManagement.adminForm.password')}</label>
            <PasswordInput id="admin-password" name="password" value={adminFormData.password} onChange={handleAdminFormChange} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-secondary mb-3">{t('userManagement.permissions.title')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(adminFormData).filter(k => k.startsWith('can_')).map((key) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name={key}
                    checked={adminFormData[key]}
                    onChange={handleAdminFormChange}
                    className="h-5 w-5 rounded bg-black/30 border-brand-border text-brand-primary focus:ring-brand-primary/50"
                  />
                  <span className="text-brand-primary">{t(`userManagement.permissions.${key.split('_').slice(1).join('')}`)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeAdminModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Class Modal */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={closeClassModal}
        title={editingClass ? t('classManagement.editClass') : t('classManagement.addClass')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleClassFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="class-name" className="block text-sm font-medium text-brand-secondary mb-2">{t('classManagement.newClassName')}</label>
            <input
              type="text"
              id="class-name"
              name="name"
              value={classFormData.name}
              onChange={handleClassFormChange}
              required
              className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeClassModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isStudentConfirmModalOpen}
        onClose={() => setIsStudentConfirmModalOpen(false)}
        onConfirm={handleStudentConfirmDelete}
        title={t('common.delete')}
        message={t('studentManagement.confirmDelete')}
      />
      <ConfirmationModal
        isOpen={isClassConfirmModalOpen}
        onClose={() => setIsClassConfirmModalOpen(false)}
        onConfirm={handleClassConfirmDelete}
        title={t('common.delete')}
        message={t('classManagement.confirmDelete')}
      />
      <ConfirmationModal
        isOpen={isAdminsConfirmModalOpen}
        onClose={() => setIsAdminsConfirmModalOpen(false)}
        onConfirm={handleAdminConfirmDelete}
        title={t('common.delete')}
        message={t('userManagement.confirmDeleteAdmin')}
      />
    </>
  );
};

export default UserManagement;
```

---

### `frontend/src/pages/admin/WeekCard.jsx`

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';

const WeekCard = ({ week, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-brand-primary flex-1 min-w-0 break-words">{week.title}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(week)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(week.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-secondary">
            <span>{t('weekManagement.table.weekNo')}: {week.week_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${!week.is_locked ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {!week.is_locked ? t('weekManagement.status.unlocked') : t('weekManagement.status.locked')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCard;
```

---

### `frontend/src/pages/admin/WeekManagement.jsx`

```jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api, { weekService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, UploadCloud, Loader2, Video, FileCheck, Trash } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';
import Modal from '../../components/Modal';
import WeekCard from './WeekCard';
import ConfirmationModal from '../../components/ConfirmationModal';

const WeekManagement = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingWeekId, setDeletingWeekId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);

  const initialFormState = {
    week_number: '',
    title: '',
    is_locked: true,
    content_cards: [{ title: '', description: '' }],
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchWeeks = useCallback(async (isInitialLoad = false) => {
    if (!token) return;
    if (isInitialLoad) setLoading(true);
    try {
      const response = await api.get('/weeks/all');
      setWeeks(response.data.sort((a, b) => a.week_number - b.week_number));
      setError('');
    } catch (err) {
      setError(t('weekManagement.errors.fetch'));
      console.error(err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    fetchWeeks(true);
  }, [fetchWeeks]);

  const openModal = (week = null) => {
    setEditingWeek(week);
    setVideoFile(null);
    setSubmissionStatus('');
    setUploadProgress(0);
    setRemoveVideo(false);
    setVideoPreview(null);

    if (week) {
      const cards = week.content_cards?.length > 0 ? week.content_cards : [{ title: '', description: '' }];
      setFormData({ ...week, content_cards: cards });
      if (week.video_url) {
        setVideoPreview(week.video_url);
      }
    } else {
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWeek(null);
    setVideoFile(null);
    setSubmissionStatus('');
    setUploadProgress(0);
    setVideoPreview(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'is_locked') {
      setFormData({ ...formData, is_locked: !checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setVideoPreview(URL.createObjectURL(e.target.files[0]));
      setRemoveVideo(false);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setRemoveVideo(true);
  };

  const handleCardChange = (index, e) => {
    const newCards = formData.content_cards.map((card, i) =>
      i === index ? { ...card, [e.target.name]: e.target.value } : card
    );
    setFormData({ ...formData, content_cards: newCards });
  };

  const addCard = () => {
    setFormData({ ...formData, content_cards: [...formData.content_cards, { title: '', description: '' }] });
  };

  const removeCard = (index) => {
    const newCards = formData.content_cards.filter((_, i) => i !== index);
    setFormData({ ...formData, content_cards: newCards });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errorKey = editingWeek ? 'weekManagement.errors.update' : 'weekManagement.errors.add';

    try {
      // Step 1: Create or Update week details
      setSubmissionStatus(t(editingWeek ? 'weekManagement.status.updatingWeek' : 'weekManagement.status.creatingWeek'));
      const weekPayload = {
        title: formData.title,
        week_number: formData.week_number,
        is_locked: formData.is_locked,
      };

      let weekResponse;
      if (editingWeek) {
        weekResponse = await api.put(`/admin/weeks/${editingWeek.id}`, weekPayload);
      } else {
        weekResponse = await api.post('/admin/weeks', weekPayload);
      }
      const weekId = weekResponse.data.id;

      // Step 2: Upload video if a new one is provided
      if (videoFile) {
        setSubmissionStatus(t('weekManagement.status.uploadingVideo'));
        await weekService.uploadWeekVideo(weekId, videoFile, setUploadProgress);
      } else if (removeVideo && editingWeek) {
        setSubmissionStatus(t('weekManagement.status.removingVideo'));
        await api.delete(`/admin/weeks/${weekId}/video`);
      }

      // Step 3: Update content cards
      setSubmissionStatus(t('weekManagement.status.savingCards'));
      if (editingWeek) {
        for (const card of editingWeek.content_cards) {
          if (card.id) {
            await api.delete(`/admin/weeks/cards/${card.id}`);
          }
        }
      }
      for (const card of formData.content_cards) {
        if (card.title && card.description) {
          await api.post(`/admin/weeks/${weekId}/cards`, card);
        }
      }

      setSubmissionStatus(t('weekManagement.status.completed'));
      await fetchWeeks();
      setTimeout(() => {
        closeModal();
        setIsSubmitting(false);
      }, 1000);

    } catch (err) {
      setError(t(errorKey));
      console.error(err);
      setSubmissionStatus('');
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingWeekId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingWeekId) return;
    setIsConfirmModalOpen(false);
    setWeeks(prevWeeks => prevWeeks.map(w => w.id === deletingWeekId ? { ...w, deleting: true } : w));
    setTimeout(async () => {
      try {
        await api.delete(`/admin/weeks/${deletingWeekId}`);
        setWeeks(prevWeeks => prevWeeks.filter(w => w.id !== deletingWeekId));
      } catch (err) {
        setError(t('weekManagement.errors.delete'));
        console.error(err);
        fetchWeeks();
      } finally {
        setDeletingWeekId(null);
      }
    }, 300);
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="week_number" className="block text-sm font-bold text-brand-secondary mb-2">{t('weekManagement.form.weekNumber')}</label>
          <input type="number" id="week_number" name="week_number" value={formData.week_number} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-brand-secondary mb-2">{t('weekManagement.form.title')}</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
        </div>
      </div>
      <div className="pt-2">
        <label className="flex items-center gap-3 text-brand-primary cursor-pointer">
          <input type="checkbox" name="is_locked" checked={!formData.is_locked} onChange={handleFormChange} className="form-checkbox h-5 w-5 bg-black/30 border-brand-border rounded text-brand-primary focus:ring-brand-primary/50" />
          <span className="font-medium">{t('weekManagement.form.unlocked')}</span>
        </label>
      </div>

      {/* Video Upload Section */}
      <div className="border-t border-brand-border pt-6">
        <h3 className="text-lg font-bold mb-4 text-brand-primary">{t('weekManagement.form.video')}</h3>
        {videoPreview ? (
          <div className="relative group">
            <div className="bg-black/30 p-3 rounded-lg flex items-center gap-4">
              <Video className="w-10 h-10 text-brand-primary"/>
              <div className="flex-grow">
                <p className="text-brand-primary font-medium truncate">{videoFile ? videoFile.name : t('weekManagement.form.currentVideo')}</p>
                <a href={videoPreview} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary hover:underline">{t('weekManagement.form.preview')}</a>
              </div>
            </div>
            <button type="button" onClick={handleRemoveVideo} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash size={16}/>
            </button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="mt-1 flex justify-center items-center w-full h-32 px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-brand-secondary" />
              <p className="text-sm text-brand-secondary">{t('weekManagement.form.uploadHint')}</p>
            </div>
            <input id="file-upload" name="video_file" type="file" className="sr-only" onChange={handleVideoFileChange} accept="video/*" />
          </label>
        )}
      </div>

      {/* Content Cards Section */}
      <div className="border-t border-brand-border pt-6">
        <h3 className="text-lg font-bold mb-4 text-brand-primary">{t('weekManagement.form.contentCards')}</h3>
        <div className="space-y-4">
          {formData.content_cards.map((card, index) => (
            <div key={index} className="bg-black/20 border border-brand-border/50 p-4 rounded-lg space-y-3 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-brand-secondary">{t('weekManagement.form.cardTitle')}</label>
                <button type="button" onClick={() => removeCard(index)} className="text-brand-secondary hover:text-red-500 transition-colors"><X size={18} /></button>
              </div>
              <input type="text" name="title" value={card.title} onChange={(e) => handleCardChange(index, e)} required className="w-full bg-black/30 border border-brand-border p-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/50" />
              <label className="text-sm font-bold text-brand-secondary mt-2 block">{t('weekManagement.form.cardDescription')}</label>
              <textarea name="description" value={card.description} onChange={(e) => handleCardChange(index, e)} required className="w-full bg-black/30 border border-brand-border p-2.5 rounded-md" rows="2"></textarea>
            </div>
          ))}
        </div>
        <button type="button" onClick={addCard} className="mt-4 flex items-center gap-2 bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-semibold py-2 px-4 rounded-lg text-sm transition-colors transform active:scale-95">
          <Plus size={16}/> {t('weekManagement.form.addCard')}
        </button>
      </div>

      {/* Submission Controls */}
      <div className="flex justify-end gap-4 pt-4 border-t border-brand-border">
        {!isSubmitting && <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>}
        <button
          type="submit"
          className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-[120px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              {submissionStatus === t('weekManagement.status.completed') ? <FileCheck className="mr-2"/> : <Loader2 className="animate-spin mr-2" />}
              <span>{submissionStatus}</span>
            </div>
          ) : (
            <span>{editingWeek ? t('common.saveChanges') : t('common.create')}</span>
          )}
        </button>
      </div>
       {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-brand-border/20 rounded-full h-2.5 mt-4">
            <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
    </form>
  );

  if (loading) return <LoadingScreen fullScreen={false} />;
  if (error) return <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg">{error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('weekManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('weekManagement.addWeek')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {weeks.map((week) => (
          <WeekCard
            key={week.id}
            week={week}
            onEdit={openModal}
            onDelete={openDeleteConfirm}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingWeek ? t('weekManagement.editWeek') : t('weekManagement.addWeek')}
      >
        {renderAddEditForm()}
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('weekManagement.confirmDelete')}
      />
    </>
  );
};

export default WeekManagement;
```

---

### `frontend/src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* PNU Arabic font (exact relative path preserved) */
@font-face {
  font-family: 'PNU';
  src: url('../../PNU-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Base styles */
@layer base {
  html, body, #root { height: 100%; }
  body { @apply bg-brand-background text-brand-primary font-arabic antialiased; }
}

/* Utilities */
@layer utilities {
  .rounded-20 { border-radius: 20px; }
  .text-shadow-soft { text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  .animate-pulse-subtle {
    animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
```

---

### `frontend/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        arabic: ["PNU", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          background: "#1a1a1a",
          gray: "#6e6c6f",
          white: "#ffffff",
          black: "#000000",
          primary: "#ffffff",
          secondary: "#a0a0a0",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      borderRadius: {
        20: "20px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.4)",
        insetSoft: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      keyframes: {
        modalIn: {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        fadeOut: {
          "100%": { opacity: 0, transform: "scale(0.95)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "modal-in": "modalIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-out": "fadeOut 300ms ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

---

### `frontend/src/App.jsx`

```jsx
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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const mobileNavLinks = (
    <div className="px-6 py-4">
      <Link to="/weeks" onClick={closeMenu} className="text-brand-secondary hover:text-brand-primary transition-colors block py-2">{t('Weeks')}</Link>
      <Link to="/leaderboard" onClick={closeMenu} className="text-brand-secondary hover:text-brand-primary transition-colors block py-2">{t('Leaderboard')}</Link>
      <div className="border-t border-brand-border my-4"></div>
      {user ? (
        <>
          {user.role === 'student' && <Link to="/dashboard" onClick={closeMenu} className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors block text-center">{t('Dashboard')}</Link>}
          {user.role === 'admin' && <Link to="/admin" onClick={closeMenu} className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors block text-center">{t('Admin Panel')}</Link>}
          <button onClick={handleLogout} className="text-brand-secondary hover:text-brand-primary transition-colors w-full text-right mt-4 block py-2">{t('Logout')}</button>
        </>
      ) : (
        <Link to="/login" onClick={closeMenu} className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors block text-center mt-2">{t('Login')}</Link>
      )}
    </div>
  );

  const desktopNavLinks = (
    <div className="flex items-center gap-5 text-sm font-medium">
      <Link to="/weeks" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Weeks')}</Link>
      <Link to="/leaderboard" className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Leaderboard')}</Link>
      {user ? (
        <>
          {user.role === 'student' && <Link to="/dashboard" className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">{t('Dashboard')}</Link>}
          {user.role === 'admin' && <Link to="/admin" className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">{t('Admin Panel')}</Link>}
          <button onClick={handleLogout} className="text-brand-secondary hover:text-brand-primary transition-colors">{t('Logout')}</button>
        </>
      ) : (
        <Link to="/login" className="bg-white text-brand-background font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">{t('Login')}</Link>
      )}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
              <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
              <span className="text-brand-primary text-xl font-bold">{t('Ghars')}</span>
            </Link>

            <div className="hidden md:flex">
              {desktopNavLinks}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-primary">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden fixed top-16 right-0 left-0 bottom-0 z-30 bg-brand-background/95 backdrop-blur-xl animate-fade-in-down">
          {mobileNavLinks}
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
```
