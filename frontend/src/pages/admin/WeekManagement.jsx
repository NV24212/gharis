import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api, { weekService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, UploadCloud, Loader2 } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';
import Modal from '../../components/Modal';
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
  const [modalStep, setModalStep] = useState(1); // 1 for upload, 2 for details
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');

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
    setModalStep(1);
    setUploadedVideoUrl('');
    setSubmissionStatus('');
    if (week) {
      const cards = week.content_cards?.length > 0 ? week.content_cards : [{ title: '', description: '' }];
      setFormData({ ...week, content_cards: cards });
      if (week.video_url) {
        setUploadedVideoUrl(week.video_url);
        setModalStep(2);
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
    setModalStep(1);
    setUploadedVideoUrl('');
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
    }
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

  const handleVideoUpload = async () => {
    if (!videoFile) return;
    setIsSubmitting(true);
    setSubmissionStatus(t('weekManagement.status.uploadingVideo'));
    try {
      // Create a temporary week to get an ID for the video path
      const tempWeekData = { title: "temp", week_number: 999, is_locked: true };
      const tempWeek = await api.post('/admin/weeks', tempWeekData);

      const response = await weekService.uploadWeekVideo(tempWeek.data.id, videoFile);
      setUploadedVideoUrl(response.video_url);
      setFormData({...formData, temp_week_id: tempWeek.data.id});
      setModalStep(2);
    } catch (err) {
      setError(t('weekManagement.errors.add')); // Generic error
    } finally {
      setIsSubmitting(false);
      setSubmissionStatus('');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(t('weekManagement.status.creatingWeek'));
    const errorKey = editingWeek ? 'weekManagement.errors.update' : 'weekManagement.errors.add';

    try {
      const weekPayload = {
        ...formData,
        video_url: uploadedVideoUrl,
      };

      let weekId;
      if (editingWeek) {
        await api.put(`/admin/weeks/${editingWeek.id}`, weekPayload);
        weekId = editingWeek.id;
      } else {
        // Use the temp week's ID to update it with the real data
        await api.put(`/admin/weeks/${formData.temp_week_id}`, weekPayload);
        weekId = formData.temp_week_id;
      }

      setSubmissionStatus(t('weekManagement.status.savingCards'));
      if (editingWeek) {
          for (const card of editingWeek.content_cards) {
              if(card.id) {
                await api.delete(`/admin/weeks/cards/${card.id}`);
              }
          }
      }
      for (const card of formData.content_cards) {
          if(card.title && card.description) {
              await api.post(`/admin/weeks/${weekId}/cards`, card);
          }
      }

      fetchWeeks();
      closeModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmissionStatus('');
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

  const renderUploadStep = () => (
    <div>
        <label className="block text-sm font-bold text-brand-secondary mb-2">
            {t('weekManagement.form.uploadLabel')}
        </label>
        <label htmlFor="file-upload" className="mt-1 flex justify-center items-center w-full h-48 px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
            <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-brand-secondary" />
                <div className="flex text-sm text-brand-secondary">
                    <span className="font-medium text-brand-primary">{t('weekManagement.form.uploadButton')}</span>
                </div>
                <p className="text-xs text-brand-secondary">{videoFile ? videoFile.name : t('weekManagement.form.uploadHint')}</p>
            </div>
            <input id="file-upload" name="video_file" type="file" className="sr-only" onChange={handleVideoFileChange} accept="video/*" />
        </label>
        <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="button"
              onClick={handleVideoUpload}
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-24"
              disabled={isSubmitting || !videoFile}
            >
              {isSubmitting ? <><Loader2 className="animate-spin mr-2" /><span>{submissionStatus}</span></> : t('common.upload')}
            </button>
        </div>
    </div>
  );

  const renderDetailsStep = () => (
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
      <div className="flex justify-end gap-4 pt-4 border-t border-brand-border">
          <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
          <button
            type="submit"
            className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-24"
            disabled={isSubmitting}
          >
            {isSubmitting ? <><Loader2 className="animate-spin mr-2" /><span>{submissionStatus}</span></> : t('common.save')}
          </button>
      </div>
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
              <tr key={week.id} className={`hover:bg-brand-border/5 transition-colors ${week.deleting ? 'animate-fade-out' : ''}`}>
                <td className="px-6 py-4">{week.week_number}</td>
                <td className="px-6 py-4">{week.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${!week.is_locked ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {!week.is_locked ? t('weekManagement.status.unlocked') : t('weekManagement.status.locked')}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openModal(week)} className="text-brand-secondary hover:text-brand-primary mr-4 transition-colors"><Edit size={18} /></button>
                  <button onClick={() => openDeleteConfirm(week.id)} className="text-brand-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingWeek ? t('weekManagement.editWeek') : t('weekManagement.addWeek')}
      >
        {modalStep === 1 && !editingWeek ? renderUploadStep() : renderDetailsStep()}
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete') + " " + t('weekManagement.title')}
        message={t('weekManagement.confirmDelete')}
      />
    </>
  );
};

export default WeekManagement;