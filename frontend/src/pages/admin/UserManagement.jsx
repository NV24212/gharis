import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api, { classService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Loader2, ChevronDown, Users, Shield } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';

const UserManagement = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'admins'

  // Students State
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', password: '', class_id: '' });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classFilter, setClassFilter] = useState('');

  const filteredStudents = useMemo(() => {
    if (!classFilter) {
      return students;
    }
    return students.filter(student => student.class_id === parseInt(classFilter));
  }, [students, classFilter]);

  // Admins State
  const [admins, setAdmins] = useState([]);
  const [isAdminsLoading, setIsAdminsLoading] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');


  const fetchStudentsData = useCallback(async (isInitialLoad = false) => {
    if (!token) return;
    if (isInitialLoad) setLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/admin/students'),
        classService.getAllClasses(),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes);
      setError('');
    } catch (err) {
      setError(t('studentManagement.errors.fetch'));
      console.error(err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [token, t]);

  const fetchAdminsData = useCallback(async () => {
    if (!token) return;
    setIsAdminsLoading(true);
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data);
    } catch (err) {
      setError(t('userManagement.errors.fetchAdmins'));
      console.error(err);
    } finally {
      setIsAdminsLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudentsData(true);
    } else if (activeTab === 'admins') {
      fetchAdminsData();
    }
  }, [activeTab, fetchStudentsData, fetchAdminsData]);

  const openModal = (student = null) => {
    setEditingStudent(student);
    setFormData(
      student
        ? { name: student.name, password: '', class_id: student.classes?.id || '' }
        : { name: '', password: '', class_id: '' }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errorKey = editingStudent ? 'studentManagement.errors.update' : 'studentManagement.errors.add';
    try {
      let payload = { ...formData, class_id: formData.class_id ? Number(formData.class_id) : null };
      if (editingStudent) {
        if (!payload.password) delete payload.password;
        await api.put(`/admin/students/${editingStudent.id}`, payload);
      } else {
        if (!payload.password) {
          setError(t('studentManagement.errors.passwordRequired'));
          setIsSubmitting(false); // Stop submission
          return;
        }
        await api.post('/admin/students', payload);
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingStudentId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingStudentId) return;

    setIsConfirmModalOpen(false);
    setStudents(prevStudents =>
      prevStudents.map(s =>
        s.id === deletingStudentId ? { ...s, deleting: true } : s
      )
    );

    setTimeout(async () => {
      try {
        await api.delete(`/admin/students/${deletingStudentId}`);
        setStudents(prevStudents => prevStudents.filter(s => s.id !== deletingStudentId));
      } catch (err) {
        setError(t('studentManagement.errors.delete'));
        console.error(err);
        fetchData(); // Revert on error
      } finally {
        setDeletingStudentId(null);
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
          onClick={() => openModal()}
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
                    <td className="px-6 py-4 whitespace-nowrap">{student.classes?.name || <span className="text-brand-secondary">{t('studentManagement.form.unassigned')}</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.points}</td>
                    <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-6">
                        <button onClick={() => openModal(student)} className="text-brand-secondary hover:text-brand-primary transition-colors"><Edit size={18} /></button>
                        <button onClick={() => openDeleteConfirm(student.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </>
  );

  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    if (!adminPassword) return;

    setIsSubmitting(true);
    try {
      await api.post('/admin/admins', { password: adminPassword });
      fetchAdminsData();
      setIsAdminModalOpen(false);
      setAdminPassword('');
    } catch (err) {
      setError(t('userManagement.errors.createAdmin'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAdminsTab = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-brand-primary">{t('userManagement.tabs.admins')}</h2>
        <button
          onClick={() => setIsAdminModalOpen(true)}
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
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('userManagement.adminId')}</th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('userManagement.createdAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-brand-border/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{admin.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(admin.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
      </div>

      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

      <div>
        {activeTab === 'students' ? renderStudentsTab() : renderAdminsTab()}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingStudent ? t('studentManagement.editStudent') : t('studentManagement.addStudent')}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-secondary mb-2">{t('studentManagement.form.name')}</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-secondary mb-2">{editingStudent ? t('studentManagement.form.newPassword') : t('studentManagement.form.password')}</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleFormChange} required={!editingStudent} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
        </div>
        <div className="relative">
            <label htmlFor="class_id" className="block text-sm font-medium text-brand-secondary mb-2">{t('studentManagement.table.class')}</label>
            <select id="class_id" name="class_id" value={formData.class_id} onChange={handleFormChange} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none">
            <option value="">{t('studentManagement.form.selectClass')}</option>
            {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 pt-8">
                <ChevronDown className="h-5 w-5 text-brand-secondary" />
            </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete') + " " + t('studentManagement.title')}
        message={t('studentManagement.confirmDelete')}
      />

      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        title={t('userManagement.addAdmin')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAdminFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-brand-secondary mb-2">{t('userManagement.adminPassword')}</label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setIsAdminModalOpen(false)} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
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
    </>
  );
};

export default UserManagement;