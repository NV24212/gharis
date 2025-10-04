import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { User, Award, BookUser } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setLoading(false);
        setError(t('No authentication token found.'));
        return;
      }
      setAuthToken(token);

      try {
        setLoading(true);
        const response = await api.get('/students/me');
        setStudent(response.data);
        setError('');
      } catch (err) {
        setError(t('Failed to fetch student data. Please try again later.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token, t]);

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-brand-content border border-brand-border rounded-2xl p-6 flex items-center gap-5">
      <div className="bg-brand-background p-3 rounded-full">
        <Icon className="h-7 w-7 text-brand-accent" />
      </div>
      <div>
        <p className="text-brand-secondary">{label}</p>
        <p className="text-brand-primary font-bold text-2xl">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-20 text-brand-secondary">{t('Loading dashboard...')}</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!student) {
    return <div className="text-center py-20 text-brand-secondary">{t('No student data available.')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <div className="flex items-center gap-4">
           <div className="bg-brand-content border border-brand-border rounded-full p-3">
             <User className="h-8 w-8 text-brand-primary" />
           </div>
           <div>
            <h1 className="text-3xl font-bold text-brand-primary">
              {t('Welcome')}, {student.name}!
            </h1>
            <p className="text-brand-secondary">مرحباً بعودتك! تابع تقدمك من هنا</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={BookUser} label={t('Class')} value={student.class_name} />
        <InfoCard icon={Award} label={t('Total Points')} value={student.points} />
      </div>
    </div>
  );
};

export default Dashboard;