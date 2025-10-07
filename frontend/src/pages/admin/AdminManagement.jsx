import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/api';
import { Plus, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';

const AdminManagement = () => {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', password: '' });

  const fetchAdmins = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
      setError('');
    } catch (err) {
      setError(t('adminManagement.errors.fetch'));
      console.error(err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAdmins(true);
  }, [fetchAdmins]);

  const openModal = () => {
    setNewAdmin({ name: '', password: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await adminService.createAdmin(newAdmin);
      await fetchAdmins();
      closeModal();
    } catch (err) {
      setError(t('adminManagement.errors.create'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('adminManagement.title')}</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('adminManagement.addAdmin')}
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-4">{error}</div>}

      <div className="bg-black/20 border border-brand-border rounded-20 overflow-hidden">
        <table className="min-w-full text-brand-primary">
          <thead className="bg-brand-border/5">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('adminManagement.table.id')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('adminManagement.table.name')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('adminManagement.table.createdAt')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-brand-border/5 transition-colors">
                <td className="px-6 py-4">{admin.id}</td>
                <td className="px-6 py-4">{admin.name}</td>
                <td className="px-6 py-4">{new Date(admin.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t('adminManagement.addAdmin')}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6 p-2">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-brand-secondary mb-2">{t('adminManagement.form.name')}</label>
            <input type="text" id="name" name="name" value={newAdmin.name} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-brand-secondary mb-2">{t('adminManagement.form.password')}</label>
            <input type="password" id="password" name="password" value={newAdmin.password} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-brand-border">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminManagement;