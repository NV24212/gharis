import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  const { t } = useTranslation();
  const { token, user } = useContext(AuthContext); // Assuming user info is in AuthContext
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!token) {
        setLoading(false);
        setError(t('Authentication required.'));
        return;
      }
      setAuthToken(token);

      try {
        setLoading(true);
        const response = await api.get('/students/leaderboard');
        setLeaderboard(response.data);
        setError('');
      } catch (err) {
        setError(t('Failed to fetch leaderboard data.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token, t]);

  const getRankIndicator = (rank) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Trophy className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-6 w-6 text-yellow-600" />;
    return <span className="text-brand-secondary font-mono text-lg">{rank}</span>;
  };

  if (loading) {
    return <div className="text-center py-20 text-brand-secondary">{t('Loading leaderboard...')}</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-primary">{t('All-Time Leaderboard')}</h1>
        <p className="text-brand-secondary mt-2">شاهد ترتيبك وترتيب زملائك في المنافسة</p>
      </header>

      <div className="bg-brand-content border border-brand-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="border-b border-brand-border">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-brand-secondary uppercase tracking-wider">{t('Rank')}</th>
                <th className="px-6 py-4 text-sm font-medium text-brand-secondary uppercase tracking-wider">{t('Name')}</th>
                <th className="px-6 py-4 text-sm font-medium text-brand-secondary uppercase tracking-wider hidden sm:table-cell">{t('Class')}</th>
                <th className="px-6 py-4 text-sm font-medium text-brand-secondary uppercase tracking-wider">{t('Points')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {leaderboard.map((student, index) => (
                <tr key={student.id} className={`transition-colors ${user?.id === student.id ? 'bg-brand-accent/10' : 'hover:bg-brand-background'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center items-center h-full w-8">
                      {getRankIndicator(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-brand-primary font-semibold">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-brand-secondary hidden sm:table-cell">{student.class_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-brand-primary font-bold">{student.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;