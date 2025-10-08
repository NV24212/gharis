import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { Star } from 'lucide-react';

const StudentPoints = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary mb-8">{t('points.title')}</h1>
      <div className="bg-black/20 border border-brand-border rounded-20 p-8 max-w-sm mx-auto text-center">
        <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <p className="text-lg text-brand-secondary mb-2">{t('points.yourTotal')}</p>
        <p className="text-5xl font-bold text-brand-primary">{user?.points || 0}</p>
      </div>
    </div>
  );
};

export default StudentPoints;