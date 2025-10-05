import React, { useState, useEffect, useContext } from 'react';
import api, { setAuthToken, classService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const StudentManagement = () => {
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
        classService.getAllClasses(),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes);
      setError('');
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (student = null) => {
    setEditingStudent(student);
    setFormData(
      student
        ? { name: student.name, password: '', class_id: student.class_id || '', points: student.points }
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
    try {
      if (editingStudent) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/admin/students/${editingStudent.id}`, payload);
      } else {
        await api.post('/admin/students', formData);
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(`Failed to ${editingStudent ? 'update' : 'add'} student.`);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الطالب؟')) {
      try {
        await api.delete(`/admin/students/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete student.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p className="text-red-500 bg-red-800 p-3 rounded-md">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلاب</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" /> إضافة طالب
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full text-white">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الاسم</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الفصل</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">النقاط</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{classes.find(c => c.id === student.class_id)?.name || 'غير محدد'}</td>
                <td className="px-6 py-4">{student.points}</td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openModal(student)} className="text-gray-400 hover:text-white mr-4"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(student.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">{editingStudent ? 'تعديل' : 'إضافة'} طالب</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="الاسم" required className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md" />
              <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder={editingStudent ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور'} required={!editingStudent} className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md" />
              <select name="class_id" value={formData.class_id} onChange={handleFormChange} className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md">
                <option value="">اختر فصلًا</option>
                {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
              {editingStudent && (<input type="number" name="points" value={formData.points} onChange={handleFormChange} placeholder="النقاط" required className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md" />)}
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">إلغاء</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;