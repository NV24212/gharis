import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { AlertTriangle, Users, Eye, UserPlus } from 'lucide-react';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-brand-background-light p-6 rounded-lg shadow-md flex items-center gap-4">
    {icon}
    <div>
      <p className="text-sm text-brand-secondary">{title}</p>
      <p className="text-2xl font-bold text-brand-primary">{value}</p>
    </div>
  </div>
);

const Analytics = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/analytics');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || t('analytics.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return <div className="text-center p-8">{t('common.loading')}...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-red-900/20 text-red-300 rounded-lg">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('common.error')}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-brand-primary">{t('analytics.title')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t('analytics.activeUsers')} value={data?.totals?.activeUsers || 0} icon={<Users className="w-8 h-8 text-blue-400" />} />
        <StatCard title={t('analytics.pageViews')} value={data?.totals?.screenPageViews || 0} icon={<Eye className="w-8 h-8 text-green-400" />} />
        <StatCard title={t('analytics.newUsers')} value={data?.totals?.newUsers || 0} icon={<UserPlus className="w-8 h-8 text-yellow-400" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-brand-background-light p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('analytics.viewsByPage')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.by_page}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="page" tick={{ fill: '#a0a0a0' }} />
              <YAxis tick={{ fill: '#a0a0a0' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                labelStyle={{ color: '#FFF' }}
              />
              <Legend wrapperStyle={{ color: '#FFF' }} />
              <Bar dataKey="views" fill="#8884d8" name={t('analytics.pageViews')} />
              <Bar dataKey="users" fill="#82ca9d" name={t('analytics.activeUsers')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-brand-background-light p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('analytics.usersByCountry')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.by_country}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="country" tick={{ fill: '#a0a0a0' }} />
              <YAxis tick={{ fill: '#a0a0a0' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                labelStyle={{ color: '#FFF' }}
              />
              <Legend wrapperStyle={{ color: '#FFF' }} />
              <Bar dataKey="users" fill="#82ca9d" name={t('analytics.activeUsers')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;