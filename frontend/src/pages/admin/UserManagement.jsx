import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api, { classService, adminService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Loader2, ChevronDown, Users, Shield, BookCopy } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';

const UserManagement = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'admins', or 'classes'

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
    if (!token) return;
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
  }, [token, t]);

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
    if (!token) return;
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
  }, [token, t]);

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
  const openStudentModal = (student = null) => {
    setEditingStudent(student);
    setStudentFormData(
      student
        ? { name: student.name, password: '', class_id: student.class?.id || '' }
        : { name: '', password: '', class_id: '' }
    );
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
        if (!payload.password) delete payload.password;
        await api.put(`/admin/students/${editingStudent.id}`, payload);
      } else {
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
  const openAdminModal = (admin = null) => {
    setEditingAdmin(admin);
    setAdminFormData(
      admin
        ? {
            name: admin.name,
            password: '',
            can_manage_admins: admin.can_manage_admins,
            can_manage_classes: admin.can_manage_classes,
            can_manage_students: admin.can_manage_students,
            can_manage_weeks: admin.can_manage_weeks,
            can_manage_points: admin.can_manage_points,
          }
        : {
            name: '',
            password: '',
            can_manage_admins: true,
            can_manage_classes: true,
            can_manage_students: true,
            can_manage_weeks: true,
            can_manage_points: true,
          }
    );
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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-brand-primary">{t('userManagement.tabs.students')}</h2>
          <div className="relative">
            <label htmlFor="classFilter" className="sr-only">{t('userManagement.filterByClass')}</label>
            <select
              id="classFilter"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-black/30 border border-brand-border text-brand-primary p-2.5 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none"
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
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('studentManagement.addStudent')}
        </button>
      </div>

      <div className="bg-black/20 border border-brand-border rounded-20 overflow-hidden">
        <table className="min-w-full text-brand-primary">
          <thead className="bg-brand-border/5">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.name')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.class')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.points')}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filteredStudents.map((student) => (
              <tr key={student.id} className={`hover:bg-brand-border/5 transition-colors ${student.deleting ? 'animate-fade-out' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.class?.name || <span className="text-brand-secondary">{t('studentManagement.form.unassigned')}</span>}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.points}</td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center gap-6">
                    <button onClick={() => openStudentModal(student)} className="text-brand-secondary hover:text-brand-primary transition-colors"><Edit size={18} /></button>
                    <button onClick={() => openStudentDeleteConfirm(student.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAdminsTab = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-brand-primary">{t('userManagement.tabs.admins')}</h2>
        <button
          onClick={() => openAdminModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('userManagement.addAdmin')}
        </button>
      </div>
      {isAdminsLoading ? (
        <LoadingScreen fullScreen={false} />
      ) : (
        <div className="bg-black/20 border border-brand-border rounded-20 overflow-hidden">
          <table className="min-w-full text-brand-primary">
            <thead className="bg-brand-border/5">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('userManagement.adminTable.name')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">{t('userManagement.adminTable.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {admins.map((admin) => (
                <tr key={admin.id} className={`hover:bg-brand-border/5 transition-colors ${admin.deleting ? 'animate-fade-out' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-6">
                      <button onClick={() => openAdminModal(admin)} className="text-brand-secondary hover:text-brand-primary transition-colors"><Edit size={18} /></button>
                      <button onClick={() => openAdminDeleteConfirm(admin.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'students' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-secondary hover:text-brand-primary'}`}
        >
          <Users size={20} />
          <span>{t('userManagement.tabs.students')}</span>
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'admins' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-secondary hover:text-brand-primary'}`}
        >
          <Shield size={20} />
          <span>{t('userManagement.tabs.admins')}</span>
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'classes' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-secondary hover:text-brand-primary'}`}
        >
          <BookCopy size={20} />
          <span>{t('userManagement.tabs.classes')}</span>
        </button>
      </div>
      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}
      <div>
        {activeTab === 'students' && renderStudentsTab()}
        {activeTab === 'admins' && renderAdminsTab()}
        {activeTab === 'classes' && renderClassesTab()}
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
            <label htmlFor="password" className="block text-sm font-medium text-brand-secondary mb-2">{editingStudent ? t('studentManagement.form.newPassword') : t('studentManagement.form.password')}</label>
            <input type="password" id="password" name="password" value={studentFormData.password} onChange={handleStudentFormChange} required={!editingStudent} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
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
            <label htmlFor="admin-password" className="block text-sm font-bold text-brand-secondary mb-2">{editingAdmin ? t('userManagement.adminForm.newPassword') : t('userManagement.adminForm.password')}</label>
            <input type="password" id="admin-password" name="password" value={adminFormData.password} onChange={handleAdminFormChange} required={!editingAdmin} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-secondary mb-3">{t('userManagement.permissions.title')}</label>
            <div className="grid grid-cols-2 gap-4">
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