import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, Hash, Type, Video, Lock, Unlock } from 'lucide-react';

// Re-using the styled components from StudentManagement for consistency
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/80 flex justify-center items-start z-50 p-4 pt-20 overflow-y-auto" onClick={onClose}>
    <div className="bg-brand-content rounded-xl shadow-card w-full max-w-2xl p-6 mb-20" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const FormInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full bg-brand-background border border-brand-border text-brand-primary p-3 pr-10 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
    />
    {Icon && <Icon className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-brand-secondary" />}
  </div>
);

const WeekManagement = () => {
  const { t } = useTranslation();
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
      const response = await api.get('/admin/weeks'); // Use admin endpoint
      setWeeks(response.data.sort((a, b) => a.week_number - b.week_number));
      setError('');
    } catch (err) {
      setError(t('Failed to fetch weeks.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (week = null) => {
    setEditingWeek(week);
    const cards = week?.content_cards && week.content_cards.length > 0 ? week.content_cards : [{ title: '', description: '' }];
    setFormData(week ? { ...week, content_cards: cards } : initialFormState);
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
    if (formData.content_cards.length > 1) {
      const newCards = formData.content_cards.filter((_, i) => i !== index);
      setFormData({ ...formData, content_cards: newCards });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingWeek;
    const payload = { ...formData, week_number: Number(formData.week_number) };
    try {
      const apiCall = isEditing
        ? api.put(`/admin/weeks/${editingWeek.id}`, payload)
        : api.post('/admin/weeks', payload);

      await apiCall;
      fetchWeeks();
      closeModal();
    } catch (err) {
      setError(t(isEditing ? 'Failed to update week.' : 'Failed to add week.'));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('Are you sure you want to delete this week? This is irreversible.'))) {
      try {
        await api.delete(`/admin/weeks/${id}`);
        fetchWeeks();
      } catch (err) {
        setError(t('Failed to delete week.'));
        console.error(err);
      }
    }
  };

  if (loading) return <p className="text-center text-brand-secondary">{t('Loading weeks...')}</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('Week Management')}</h1>
        <button onClick={() => openModal()} className="bg-brand-accent text-brand-background font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition hover:opacity-90">
          <Plus className="h-5 w-5" /> {t('Add Week')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeks.map((week) => (
          <div key={week.id} className="bg-brand-content rounded-xl shadow-card border border-brand-border p-5 flex flex-col justify-between transition hover:-translate-y-1">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-brand-primary mb-1">{week.title}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${week.unlocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {t(week.unlocked ? 'Unlocked' : 'Locked')}
                </span>
              </div>
              <p className="text-brand-secondary">{t('Week No.')} {week.week_number}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => openModal(week)} className="p-2 text-brand-secondary hover:text-brand-primary transition"><Edit size={18} /></button>
              <button onClick={() => handleDelete(week.id)} className="p-2 text-brand-secondary hover:text-red-500 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-brand-primary">{t(editingWeek ? 'Edit Week' : 'Add Week')}</h2>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput icon={Hash} type="number" name="week_number" value={formData.week_number} onChange={handleFormChange} placeholder={t('Week No.')} required />
              <FormInput icon={Type} type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder={t('Title')} required />
            </div>
            <FormInput icon={Video} type="text" name="video_url" value={formData.video_url} onChange={handleFormChange} placeholder={t('Video URL')} required />
            <label className="flex items-center gap-3 text-brand-primary cursor-pointer">
              <input type="checkbox" name="unlocked" checked={formData.unlocked} onChange={handleFormChange} className="sr-only peer" />
              <div className="relative w-11 h-6 bg-brand-background rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-accent peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              {formData.unlocked ? <Unlock className="h-5 w-5 text-green-400" /> : <Lock className="h-5 w-5 text-brand-secondary" />}
              <span>{t(formData.unlocked ? 'Unlocked' : 'Locked')}</span>
            </label>

            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-semibold text-brand-primary">{t('Content Cards')}</h3>
              {formData.content_cards.map((card, index) => (
                <div key={index} className="bg-brand-background p-4 rounded-lg space-y-3 relative border border-brand-border">
                  {formData.content_cards.length > 1 && <button type="button" onClick={() => removeCard(index)} className="absolute top-3 right-3 text-brand-secondary hover:text-red-500"><X size={18} /></button>}
                  <FormInput name="title" value={card.title} onChange={(e) => handleCardChange(index, e)} placeholder={t('Card Title')} required />
                  <textarea name="description" value={card.description} onChange={(e) => handleCardChange(index, e)} placeholder={t('Card Description')} required className="w-full h-24 bg-brand-background border border-brand-border text-brand-primary p-3 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none transition resize-none"></textarea>
                </div>
              ))}
              <button type="button" onClick={addCard} className="bg-brand-border text-brand-secondary font-bold py-2 px-4 rounded-lg text-sm transition hover:text-brand-primary hover:border-brand-accent">
                {t('Add Card')}
              </button>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={closeModal} className="bg-transparent text-brand-secondary font-bold py-2 px-4 rounded-lg transition hover:text-brand-primary">{t('Cancel')}</button>
              <button type="submit" className="bg-brand-accent text-brand-background font-bold py-2 px-4 rounded-lg transition hover:opacity-90">{t('Save')}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WeekManagement;