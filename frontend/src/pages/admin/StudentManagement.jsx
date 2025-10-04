import React, { useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../../services/api';
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
        api.get('/students'),
        api.get('/classes'),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
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
    try {
      if (editingStudent) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/students/${editingStudent.id}`, payload);
      } else {
        await api.post('/students', formData);
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(`Failed to ${editingStudent ? 'update' : 'add'} student.`);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete student.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Student
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.class_name}</td>
                <td className="px-6 py-4">{student.points}</td>
                <td className="px-6 py-4 text-right">
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
            <h2 className="text-xl font-bold mb-6">{editingStudent ? 'Edit' : 'Add'} Student</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" required className="w-full bg-gray-700 text-white p-2 rounded-md" />
              <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder={editingStudent ? 'New Password (optional)' : 'Password'} required={!editingStudent} className="w-full bg-gray-700 text-white p-2 rounded-md" />
              <select name="class_id" value={formData.class_id} onChange={handleFormChange} required className="w-full bg-gray-700 text-white p-2 rounded-md">
                <option value="">Select Class</option>
                {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
              {editingStudent && (<input type="number" name="points" value={formData.points} onChange={handleFormChange} placeholder="Points" required className="w-full bg-gray-700 text-white p-2 rounded-md" />)}
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;