import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { AlertTriangle, RefreshCw, Users, Eye, UserPlus, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

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

// Reusable Chart Component
const CustomChart = ({ type = 'bar', data, xAxisKey, yAxisKey, dataKey, name, yAxisKey2, dataKey2, name2 }) => {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const ChartElement = type === 'line' ? Line : Bar;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey={xAxisKey} tick={{ fill: '#a0a0a0' }} />
        <YAxis yAxisId="left" tick={{ fill: '#a0a0a0' }} />
        {yAxisKey2 && <YAxis yAxisId="right" orientation="right" tick={{ fill: '#a0a0a0' }} />}
        <Tooltip
          contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
          labelStyle={{ color: '#FFF' }}
        />
        <Legend wrapperStyle={{ color: '#FFF' }} />
        <ChartElement yAxisId="left" type="monotone" dataKey={dataKey} fill="#8884d8" name={name} />
        {dataKey2 && <ChartElement yAxisId={yAxisKey2 ? "right" : "left"} type="monotone" dataKey={dataKey2} fill="#82ca9d" name={name2} />}
      </ChartComponent>
    </ResponsiveContainer>
  );
};

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
          <Tab id="trends" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.trends')}</Tab>
          <Tab id="content" activeTab={activeTab} setActiveTab={setActiveTab}>{t('analytics.tabs.content')}</Tab>
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        <TabPanel id="overview" activeTab={activeTab}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title={t('analytics.overview.activeUsers')} value={data?.overview?.activeUsers} icon={<Users className="w-6 h-6 text-blue-400" />} />
            <StatCard title={t('analytics.overview.totalUsers')} value={data?.overview?.totalUsers} icon={<UserPlus className="w-6 h-6 text-green-400" />} />
            <StatCard title={t('analytics.overview.pageViews')} value={data?.overview?.screenPageViews} icon={<Eye className="w-6 h-6 text-indigo-400" />} />
          </div>
        </TabPanel>
         <TabPanel id="trends" activeTab={activeTab}>
          <div className="space-y-8">
            <Section title={t('analytics.trends.usersPerDay')}>
              <CustomChart type="line" data={data?.trends?.usersPerDay} xAxisKey="date" dataKey="users" name={t('analytics.overview.activeUsers')} />
            </Section>
            <Section title={t('analytics.trends.usersPerWeek')}>
               <CustomChart type="line" data={data?.trends?.usersPerWeek} xAxisKey="week" dataKey="users" name={t('analytics.overview.activeUsers')} />
            </Section>
          </div>
        </TabPanel>
        <TabPanel id="content" activeTab={activeTab}>
          <Section title={t('analytics.content.byPage')}>
            <DataTable
              data={data?.content?.byPage}
              columns={[
                { key: 'unifiedScreenName', header: t('analytics.content.page') },
                { key: 'views', header: t('analytics.overview.pageViews') },
                { key: 'sessions', header: t('analytics.overview.sessions') },
              ]}
            />
            <div className="mt-8">
               <ResponsiveContainer width="100%" height={data?.content?.byPage?.length * 40}>
                <BarChart data={data?.content?.byPage} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis type="number" tick={{ fill: '#a0a0a0' }} />
                  <YAxis type="category" dataKey="unifiedScreenName" tick={{ fill: '#a0a0a0' }} width={150} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                    labelStyle={{ color: '#FFF' }}
                  />
                  <Legend wrapperStyle={{ color: '#FFF' }} />
                  <Bar dataKey="views" fill="#8884d8" name={t('analytics.overview.pageViews')}>
                     <LabelList dataKey="views" position="right" style={{ fill: 'white' }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </TabPanel>
      </div>
    </div>
  );
};

export default Analytics;