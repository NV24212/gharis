import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import Section from '../components/Section';

const Leaderboard = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data);
        setError('');
      } catch (err) {
        setError(t('leaderboard.errors.fetch'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [t]);

  if (loading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (error) {
    return (
        <Section title={t('leaderboard.title')}>
            <p className="text-center text-red-400">{error}</p>
        </Section>
    );
  }

  return (
    <Section id="leaderboard" title={t('leaderboard.title')}>
      <div className="bg-black/20 border border-brand-border rounded-20 overflow-hidden shadow-card">
        <table className="min-w-full text-brand-primary">
          <thead className="bg-brand-border/5">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('leaderboard.rank')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('leaderboard.name')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('leaderboard.class')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('leaderboard.points')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {leaderboard.map((student, index) => (
              <tr key={student.id} className="hover:bg-brand-border/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.classes?.name || t('studentManagement.form.unassigned')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
};

export default Leaderboard;