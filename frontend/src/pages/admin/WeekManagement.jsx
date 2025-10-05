import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';

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

  const fetchWeeks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setAuthToken(token);
    try {
      const response = await api.get('/weeks/all');
      setWeeks(response.data.sort((a, b) => a.week_number - b.week_number));
      setError('');
    } catch (err) {
      setError(t('weekManagement.errors.fetch'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    fetchWeeks();
  }, [fetchWeeks]);

  const openModal = (week = null) => {
    setEditingWeek(week);
    const cards = week?.content_cards?.length > 0 ? week.content_cards : [{ title: '', description: '' }];
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
    const newCards = formData.content_cards.filter((_, i) => i !== index);
    setFormData({ ...formData, content_cards: newCards });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, week_number: Number(formData.week_number) };
    const errorKey = editingWeek ? 'weekManagement.errors.update' : 'weekManagement.errors.add';
    try {
      if (editingWeek) {
        // This assumes the backend can handle updates to nested cards
        await api.put(`/admin/weeks/${editingWeek.id}`, payload);
      } else {
        await api.post('/admin/weeks', payload);
      }
      fetchWeeks();
      closeModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('weekManagement.confirmDelete'))) {
      try {
        await api.delete(`/admin/weeks/${id}`);
        fetchWeeks();
      } catch (err) {
        setError(t('weekManagement.errors.delete'));
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-8">{t('common.loading')}</div>;
  if (error) return <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg">{error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('weekManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200"
        >
          <Plus size={20} /> {t('weekManagement.addWeek')}
        </button>
      </div>

      <div className="bg-black/20 border border-brand-border rounded-20 overflow-hidden">
        <table className="min-w-full text-brand-primary">
          <thead className="bg-brand-border/5">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('weekManagement.table.weekNo')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('weekManagement.table.title')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('weekManagement.table.status')}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">{t('weekManagement.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {weeks.map((week) => (
              <tr key={week.id} className="hover:bg-brand-border/5 transition-colors">
                <td className="px-6 py-4">{week.week_number}</td>
                <td className="px-6 py-4">{week.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${week.unlocked ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {week.unlocked ? t('weekManagement.status.unlocked') : t('weekManagement.status.locked')}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openModal(week)} className="text-brand-secondary hover:text-brand-primary mr-4 transition-colors"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(week.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start z-50 overflow-y-auto p-4 animate-fade-in-up">
          <div className="bg-brand-background border border-brand-border rounded-20 shadow-card w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-brand-border">
                <h2 className="text-xl font-bold">{editingWeek ? t('weekManagement.editWeek') : t('weekManagement.addWeek')}</h2>
                <button onClick={closeModal} className="text-brand-secondary hover:text-brand-primary transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="number" name="week_number" value={formData.week_number} onChange={handleFormChange} placeholder={t('weekManagement.form.weekNumber')} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder={t('weekManagement.form.title')} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
              </div>
              <input type="text" name="video_url" value={formData.video_url} onChange={handleFormChange} placeholder={t('weekManagement.form.videoUrl')} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
              <label className="flex items-center gap-3 text-brand-primary cursor-pointer">
                <input type="checkbox" name="unlocked" checked={formData.unlocked} onChange={handleFormChange} className="form-checkbox h-5 w-5 bg-black/30 border-brand-border rounded text-brand-primary focus:ring-brand-primary/50" />
                <span>{t('weekManagement.form.unlocked')}</span>
              </label>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">{t('weekManagement.form.contentCards')}</h3>
                <div className="space-y-4">
                  {formData.content_cards.map((card, index) => (
                    <div key={index} className="bg-black/20 border border-brand-border/50 p-4 rounded-lg space-y-3 relative">
                      <button type="button" onClick={() => removeCard(index)} className="absolute top-3 left-3 text-brand-secondary hover:text-red-500 transition-colors"><X size={18} /></button>
                      <input type="text" name="title" value={card.title} onChange={(e) => handleCardChange(index, e)} placeholder={t('weekManagement.form.cardTitle')} required className="w-full bg-black/30 border border-brand-border p-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/50" />
                      <textarea name="description" value={card.description} onChange={(e) => handleCardChange(index, e)} placeholder={t('weekManagement.form.cardDescription')} required className="w-full bg-black/30 border border-brand-border p-2.5 rounded-md" rows="2"></textarea>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addCard} className="mt-4 bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-semibold py-2 px-4 rounded-lg text-sm transition-colors">{t('weekManagement.form.addCard')}</button>
              </div>

              <div className="flex justify-end gap-4 pt-6">
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

export default WeekManagement;