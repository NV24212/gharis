import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { AlertTriangle, RefreshCw, Users, Eye, UserPlus, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Reusable Tab Component
const Tab = ({ id, activeTab, setActiveTab, children }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none
      ${
        activeTab === id
          ? 'border-b-2 border-brand-primary text-brand-primary'
          : 'text-brand-secondary hover:text-brand-primary'
      }`}
  >
    {children}
  </button>
);

// Reusable TabPanel Component
const TabPanel = ({ id, activeTab, children }) => (
  <div className={`${activeTab === id ? 'block' : 'hidden'} py-6`}>
    {children}
  </div>
);

// Stat Card for Overview
const StatCard = ({ title, value, icon }) => (
  <div className="bg-brand-background-light p-6 rounded-lg shadow-md flex items-start gap-4">
    <div className="bg-gray-700 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-brand-secondary">{title}</p>
      <p className="text-3xl font-bold text-brand-primary">{value || '0'}</p>
    </div>
  </div>
);

// Section Wrapper
const Section = ({ title, children }) => (
  <div className="bg-brand-background-light p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4 text-brand-primary">{title}</h2>
    {children}
  </div>
);

// Reusable Bar Chart
const CustomBarChart = ({ data, xAxisKey, bar1Key, bar1Name, bar2Key, bar2Name }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
      <XAxis dataKey={xAxisKey} tick={{ fill: '#a0a0a0' }} />
      <YAxis tick={{ fill: '#a0a0a0' }} />
      <Tooltip
        contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
        labelStyle={{ color: '#FFF' }}
      />
      <Legend wrapperStyle={{ color: '#FFF' }} />
      <Bar dataKey={bar1Key} fill="#8884d8" name={bar1Name} />
      {bar2Key && <Bar dataKey={bar2Key} fill="#82ca9d" name={bar2Name} />}
    </BarChart>
  </ResponsiveContainer>
);

// Reusable Data Table
const DataTable = ({ data, columns }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-400">
      <thead className="text-xs text-gray-300 uppercase bg-gray-700">
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" className="px-6 py-3">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <tr key={index} className="bg-brand-background-light border-b border-gray-700 hover:bg-gray-700/50">
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-4">{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const Analytics = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/analytics');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || t('analytics.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !data) { // Show full screen loading only on initial load
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-red-900/20 text-red-300 rounded-lg">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('common.error')}</h2>
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-primary">{t('analytics.title')}</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-brand-background-light hover:bg-gray-700 text-brand-primary rounded-lg flex items-center gap-2 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <Tab id="overview" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.overview')}</Tab>
          <Tab id="audience" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.audience')}</Tab>
          <Tab id="acquisition" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.acquisition')}</Tab>
          <Tab id="technology" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.technology')}</Tab>
          <Tab id="content" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.content')}</Tab>
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        <TabPanel id="overview" activeTab={activeTab}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title={t('analytics.overview.activeUsers')} value={data?.overview?.activeUsers} icon={<Users className="w-6 h-6 text-blue-400" />} />
            <StatCard title={t('analytics.overview.newUsers')} value={data?.overview?.newUsers} icon={<UserPlus className="w-6 h-6 text-yellow-400" />} />
            <StatCard title={t('analytics.overview.sessions')} value={data?.overview?.sessions} icon={<TrendingUp className="w-6 h-6 text-green-400" />} />
            <StatCard title={t('analytics.overview.pageViews')} value={data?.overview?.screenPageViews} icon={<Eye className="w-6 h-6 text-indigo-400" />} />
            <StatCard title={t('analytics.overview.avgSessionDuration')} value={data?.overview?.averageSessionDuration} icon={<Clock className="w-6 h-6 text-red-400" />} />
            <StatCard title={t('analytics.overview.bounceRate')} value={`${(parseFloat(data?.overview?.bounceRate || 0) * 100).toFixed(2)}%`} icon={<BarChart3 className="w-6 h-6 text-purple-400" />} />
          </div>
        </TabPanel>
        <TabPanel id="audience" activeTab={activeTab}>
          <Section title={t('analytics.audience.byCountry')}>
            <CustomBarChart
              data={data?.audience?.byCountry}
              xAxisKey="country"
              bar1Key="activeUsers"
              bar1Name={t('analytics.overview.activeUsers')}
              bar2Key="sessions"
              bar2Name={t('analytics.overview.sessions')}
            />
          </Section>
        </TabPanel>
        <TabPanel id="acquisition" activeTab={activeTab}>
           <Section title={t('analytics.acquisition.bySourceMedium')}>
             <DataTable
              data={data?.acquisition?.bySourceMedium}
              columns={[
                { key: 'sessionSourceMedium', header: t('analytics.acquisition.sourceMedium') },
                { key: 'sessions', header: t('analytics.overview.sessions') },
                { key: 'newUsers', header: t('analytics.overview.newUsers') },
              ]}
            />
          </Section>
        </TabPanel>
        <TabPanel id="technology" activeTab={activeTab}>
          <Section title={t('analytics.technology.byDevice')}>
            <CustomBarChart
              data={data?.technology?.byDevice}
              xAxisKey="deviceCategory"
              bar1Key="activeUsers"
              bar1Name={t('analytics.overview.activeUsers')}
            />
          </Section>
        </TabPanel>
        <TabPanel id="content" activeTab={activeTab}>
          <Section title={t('analytics.content.byPage')}>
            <DataTable
              data={data?.content?.byPage}
              columns={[
                { key: 'unifiedScreenName', header: t('analytics.content.page') },
                { key: 'screenPageViews', header: t('analytics.overview.pageViews') },
                { key: 'sessions', header: t('analytics.overview.sessions') },
              ]}
            />
          </Section>
        </TabPanel>
      </div>
    </div>
  );
};

export default Analytics;