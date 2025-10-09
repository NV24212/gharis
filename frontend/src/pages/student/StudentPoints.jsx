import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { CacheBusterContext } from '../../context/CacheBusterContext';
import { Star, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-black/20 border border-brand-border rounded-20 p-6 flex items-center gap-6">
    <div className={`p-4 rounded-full bg-brand-border/10 ${color}`}>
      <Icon className="h-8 w-8" />
    </div>
    <div>
      <p className="text-brand-secondary font-medium">{title}</p>
      <p className="text-3xl font-bold text-brand-primary">{value}</p>
    </div>
  </div>
);

const StudentPoints = () => {
  const { t } = useTranslation();
  const { user, fetchCurrentUser } = useContext(AuthContext);
  const { cacheBuster } = useContext(CacheBusterContext);

  useEffect(() => {
    if (fetchCurrentUser) {
      fetchCurrentUser();
    }
  }, [cacheBuster, fetchCurrentUser]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-primary">
        {t('dashboard.welcome')} <span className="text-yellow-400">{user?.name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={Star}
          title={t('dashboard.points')}
          value={user?.points || 0}
          color="text-yellow-400"
        />
        <StatCard
          icon={Users}
          title={t('dashboard.class')}
          value={user?.class?.name || t('dashboard.noClass')}
          color="text-cyan-400"
        />
      </div>
    </div>
  );
};

export default StudentPoints;