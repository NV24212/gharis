import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Lock, ArrowLeft } from 'lucide-react';

const WeekCard = ({ week }) => {
  const { t } = useTranslation();
  const isLocked = !week.unlocked;

  const cardContent = (
    <div className="p-6">
      <h3 className="text-brand-primary font-bold text-xl">{`${t('Week')} ${week.week_number}`}</h3>
      <p className="text-brand-secondary mt-1 truncate">{week.title}</p>
      <div className="mt-4">
        {isLocked ? (
          <div className="flex items-center gap-2 text-brand-secondary">
            <Lock size={16} />
            <span>{t('Locked')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-brand-accent font-bold group-hover:gap-3 transition-all">
            <span>{t('Enter')}</span>
            <ArrowLeft size={20} />
          </div>
        )}
      </div>
    </div>
  );

  const cardClasses = `
    bg-brand-content border border-brand-border rounded-2xl shadow-card
    transition-all duration-300 ease-in-out
    ${isLocked
      ? 'cursor-not-allowed filter grayscale-[50%] opacity-60'
      : 'hover:-translate-y-1 hover:shadow-lg hover:border-brand-accent/50 group'
    }
  `;

  if (isLocked) {
    return <div className={cardClasses}>{cardContent}</div>;
  }

  return (
    <Link to={`/weeks/${week.id}`} className={cardClasses}>
      {cardContent}
    </Link>
  );
};

const Weeks = () => {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/weeks');
        // Sort weeks by week number before setting state
        const sortedWeeks = response.data.sort((a, b) => a.week_number - b.week_number);
        setWeeks(sortedWeeks);
        setError('');
      } catch (err) {
        setError(t('Failed to fetch weeks.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();
  }, [t]);

  if (loading) {
    return <div className="text-center py-20 text-brand-secondary">{t('Loading weeks...')}</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-primary">{t('Weeks')}</h1>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeks.map((week) => (
          <WeekCard key={week.id} week={week} />
        ))}
      </div>
    </div>
  );
};

export default Weeks;