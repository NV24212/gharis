import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, User, Key, Star } from 'lucide-react';

// A styled modal component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4" onClick={onClose}>
    <div className="bg-brand-content rounded-xl shadow-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// A styled input component
const FormInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full bg-brand-background border border-brand-border text-brand-primary p-3 pr-10 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
    />
    {Icon && <Icon className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-brand-secondary" />}
  </div>
);

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

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/classes'),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
      setError('');
    } catch (err) {
      setError(t('Failed to fetch data.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (student = null) => {
    setEditingStudent(student);
    setFormData(
      student
        ? { name: student.name, password: '', class_id: student.class_id, points: student.points }
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
    const isEditing = !!editingStudent;
    try {
      const payload = { ...formData };
      if (isEditing && !payload.password) {
        delete payload.password;
      }
      const apiCall = isEditing
        ? api.put(`/admin/students/${editingStudent.id}`, payload)
        : api.post('/admin/students', payload);

      await apiCall;
      fetchData();
      closeModal();
    } catch (err) {
      setError(t(isEditing ? 'Failed to update student.' : 'Failed to add student.'));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    // A simple confirmation for now, can be replaced by a custom modal later
    if (window.confirm(t('Are you sure you want to delete this student?'))) {
      try {
        await api.delete(`/admin/students/${id}`);
        fetchData();
      } catch (err) {
        setError(t('Failed to delete student.'));
        console.error(err);
      }
    }
  };

  if (loading) return <p className="text-center text-brand-secondary">{t('Loading...')}</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('Student Management')}</h1>
        <button
          onClick={() => openModal()}
          className="bg-brand-accent text-brand-background font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition hover:opacity-90"
        >
          <Plus className="h-5 w-5" /> {t('Add Student')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-brand-content rounded-xl shadow-card border border-brand-border p-5 flex flex-col justify-between transition hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-bold text-brand-primary truncate">{student.name}</h3>
              <p className="text-brand-secondary">{student.class_name}</p>
              <div className="flex items-center gap-2 mt-4 text-brand-accent">
                <Star className="h-5 w-5" />
                <span className="font-bold text-lg">{student.points} {t('Points')}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => openModal(student)} className="p-2 text-brand-secondary hover:text-brand-primary transition"><Edit size={18} /></button>
              <button onClick={() => handleDelete(student.id)} className="p-2 text-brand-secondary hover:text-red-500 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-brand-primary">{t(editingStudent ? 'Edit Student' : 'Add Student')}</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormInput icon={User} type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder={t('Name')} required />
            <FormInput icon={Key} type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder={t(editingStudent ? 'New Password (optional)' : 'Password')} required={!editingStudent} />
            <div className="relative">
              <select name="class_id" value={formData.class_id} onChange={handleFormChange} required className="w-full bg-brand-background border border-brand-border text-brand-primary p-3 pr-10 rounded-lg appearance-none focus:ring-2 focus:ring-brand-accent focus:outline-none transition">
                <option value="">{t('Select Class')}</option>
                {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            {editingStudent && (<FormInput icon={Star} type="number" name="points" value={formData.points} onChange={handleFormChange} placeholder={t('Points')} required />)}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={closeModal} className="bg-brand-content text-brand-secondary font-bold py-2 px-4 rounded-lg transition hover:text-brand-primary">{t('Cancel')}</button>
              <button type="submit" className="bg-brand-accent text-brand-background font-bold py-2 px-4 rounded-lg transition hover:opacity-90">{t('Save')}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentManagement;