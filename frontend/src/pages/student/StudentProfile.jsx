import React, { useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { UploadCloud, Loader2 } from 'lucide-react';
import { logoUrl } from '../../data/site';

const StudentProfile = () => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(AuthContext);
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
      const response = await api.post('/profile/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser((prevUser) => ({
        ...prevUser,
        profile_pic_url: response.data.profile_pic_url,
      }));

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
          <img
            src={user?.profile_pic_url || logoUrl}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-brand-border"
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-brand-secondary">{user?.class?.name || t('studentManagement.form.unassigned')}</p>
          </div>
          <button
            onClick={handleAvatarClick}
            className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary font-bold py-2 px-4 rounded-lg hover:bg-brand-primary/20 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
            <span>{t('profile.uploadNewPhoto')}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;