import React, { useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Modal from '../../components/Modal';

const WeekManagement = () => {
  const { token } = useContext(AuthContext);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);

  const initialFormState = {
    week_number: '',
    title: '',
    video_url: '',
    unlocked: false,
    content_cards: [{ title: '', description: '' }],
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchWeeks();
    }
  }, [token]);

  const fetchWeeks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/weeks/all'); // Fetch all weeks, including locked ones
      setWeeks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch weeks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (week = null) => {
    setEditingWeek(week);
    setFormData(week ? { ...week, content_cards: week.content_cards.length > 0 ? week.content_cards : [{ title: '', description: '' }] } : initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWeek(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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
    const payload = { ...formData, week_number: Number(formData.week_number) };
    try {
      if (editingWeek) {
        await api.put(`/weeks/${editingWeek.id}`, payload);
      } else {
        await api.post('/weeks', payload);
      }
      fetchWeeks();
      closeModal();
    } catch (err) {
      setError(`Failed to ${editingWeek ? 'update' : 'add'} week.`);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this week? This is irreversible.')) {
      try {
        await api.delete(`/weeks/${id}`);
        fetchWeeks();
      } catch (err) {
        setError('Failed to delete week.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading weeks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Week Management</h1>
        <button onClick={() => openModal()} className="bg-black hover:bg-gray-800 border border-gray-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
          <Plus className="mr-2 h-5 w-5" /> Add Week
        </button>
      </div>

      <div className="bg-black border border-gray-600 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full text-white">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Week No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {weeks.map((week) => (
              <tr key={week.id}>
                <td className="px-6 py-4">{week.week_number}</td>
                <td className="px-6 py-4">{week.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${week.unlocked ? 'bg-green-600' : 'bg-red-600'}`}>
                    {week.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(week)} className="text-gray-400 hover:text-white mr-4"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(week.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingWeek ? 'Edit Week' : 'Add Week'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Main week details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="week_number" value={formData.week_number} onChange={handleFormChange} placeholder="Week Number" required className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md" />
            <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="Title" required className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md" />
          </div>
          <input type="text" name="video_url" value={formData.video_url} onChange={handleFormChange} placeholder="Video URL" required className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded-md" />
          <label className="flex items-center space-x-2 text-gray-300">
            <input type="checkbox" name="unlocked" checked={formData.unlocked} onChange={handleFormChange} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded text-gray-400 focus:ring-gray-500" />
            <span>Unlocked</span>
          </label>

          {/* Content Cards */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">Content Cards</h3>
            {formData.content_cards.map((card, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-md mb-4 space-y-3 relative border border-gray-600">
                <button type="button" onClick={() => removeCard(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={18} /></button>
                <input type="text" name="title" value={card.title} onChange={(e) => handleCardChange(index, e)} placeholder="Card Title" required className="w-full bg-gray-800 border border-gray-600 p-2 rounded-md" />
                <textarea name="description" value={card.description} onChange={(e) => handleCardChange(index, e)} placeholder="Card Description" required className="w-full bg-gray-800 border border-gray-600 p-2 rounded-md" rows="2"></textarea>
              </div>
            ))}
            <button type="button" onClick={addCard} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm">Add Card</button>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={closeModal} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
            <button type="submit" className="bg-black hover:bg-gray-800 border border-gray-600 text-white font-bold py-2 px-4 rounded-md">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WeekManagement;