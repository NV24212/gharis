import React, { useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Edit, Loader2 } from 'lucide-react';
import { logoUrl } from '../../data/site';

const AdminProfile = () => {
  const { t } = useTranslation();
  const { user, login } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // The user router in profile.py handles uploads for the logged-in user (admin or student)
      await api.post('/profile/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Refresh user data in context by re-triggering login with the same token
      const token = localStorage.getItem('token');
      if (token) {
        login(token);
      }

    } catch (err) {
      setError(t('profile.errors.upload'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary mb-8">{t('profile.title')}</h1>
      <div className="bg-black/20 border border-brand-border rounded-20 p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <img
              src={user?.profile_pic_url || logoUrl}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border-4 border-brand-border"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Edit size={32} />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-brand-secondary">{t('userManagement.tabs.admins')}</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;