import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api, { classService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

const StudentManagement = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', password: '', class_id: '', points: 0 });

  const fetchData = useCallback(async () => {
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
      setError(t('studentManagement.errors.fetch'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (student = null) => {
    setEditingStudent(student);
    setFormData(
      student
        ? { name: student.name, password: '', class_id: student.classes?.id || '', points: student.points }
        : { name: '', password: '', class_id: '', points: 0 }
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
    const errorKey = editingStudent ? 'studentManagement.errors.update' : 'studentManagement.errors.add';
    try {
      let payload = { ...formData, points: Number(formData.points) };
      if (editingStudent) {
        if (!payload.password) delete payload.password;
        await api.put(`/admin/students/${editingStudent.id}`, payload);
      } else {
        if (!payload.password) {
            setError("Password is required for new students."); // Or use a translation key
            return;
        }
        await api.post('/admin/students', payload);
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('studentManagement.confirmDelete'))) {
      try {
        await api.delete(`/admin/students/${id}`);
        fetchData();
      } catch (err) {
        setError(t('studentManagement.errors.delete'));
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} />;
  if (error) return <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg">{error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('studentManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200"
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
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-brand-border/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.classes?.name || <span className="text-brand-secondary">{t('studentManagement.form.unassigned')}</span>}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.points}</td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openModal(student)} className="text-brand-secondary hover:text-brand-primary mr-4 transition-colors"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(student.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in-up">
          <div className="bg-brand-background border border-brand-border rounded-20 shadow-card w-full max-w-md m-4">
            <div className="flex justify-between items-center p-6 border-b border-brand-border">
                <h2 className="text-xl font-bold">{editingStudent ? t('studentManagement.editStudent') : t('studentManagement.addStudent')}</h2>
                <button onClick={closeModal} className="text-brand-secondary hover:text-brand-primary transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder={t('studentManagement.form.name')} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
              <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder={editingStudent ? t('studentManagement.form.newPassword') : t('studentManagement.form.password')} required={!editingStudent} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
              <select name="class_id" value={formData.class_id} onChange={handleFormChange} className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                <option value="">{t('studentManagement.form.selectClass')}</option>
                {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
              {editingStudent && (<input type="number" name="points" value={formData.points} onChange={handleFormChange} placeholder={t('studentManagement.table.points')} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />)}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
                <button type="submit" className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentManagement;