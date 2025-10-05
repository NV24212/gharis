import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { User, Star, Award } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setLoading(false);
        setError('Not authenticated'); // Should be handled by ProtectedRoute, but as a fallback
        return;
      }
      setAuthToken(token);
      try {
        const response = await api.get('/dashboard/me');
        setStudentData(response.data);
      } catch (err) {
        setError(t('dashboard.errors.fetch'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token, t]);

  if (loading) {
    return <div className="text-center p-10">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-400">{error}</div>;
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 animate-fade-in-up">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-brand-primary mb-2">
            {t('dashboard.welcome')} {studentData.name}
          </h1>
          <p className="text-lg text-brand-secondary">{t('dashboard.title')}</p>
        </header>

        <div className="bg-black/20 border border-brand-border rounded-20 shadow-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-brand-border/5 rounded-20">
            <Star className="h-12 w-12 text-yellow-400 mb-4" />
            <p className="text-xl text-brand-secondary">{t('dashboard.points')}</p>
            <p className="text-5xl font-bold text-brand-primary">{studentData.points}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-6 bg-brand-border/5 rounded-20">
            <Award className="h-12 w-12 text-cyan-400 mb-4" />
            <p className="text-xl text-brand-secondary">{t('dashboard.class')}</p>
            <p className="text-4xl font-bold text-brand-primary">
              {studentData.classes ? studentData.classes.name : t('dashboard.noClass')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;