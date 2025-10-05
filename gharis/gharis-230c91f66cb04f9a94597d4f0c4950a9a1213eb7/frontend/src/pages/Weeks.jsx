import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { weekService } from '../services/api';
import Section from '../components/Section.jsx';
import LoadingScreen from '../components/LoadingScreen';
import { Lock, ArrowLeft } from 'lucide-react';

function WeekCard({ week }) {
  const { t } = useTranslation();
  const isLocked = week.is_locked;

  return (
    <div className="relative rounded-20 border border-brand-border bg-black/20 p-6 shadow-card transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-brand-primary font-bold text-xl">{`${t('weeks.week')} ${week.week_number}`}</h3>
          <p className="text-brand-secondary mt-1">{week.title}</p>
        </div>
        {isLocked ? (
          <span className="flex items-center gap-2 rounded-full border border-brand-border text-brand-secondary px-3 py-1.5 select-none text-sm">
            <Lock size={14} />
            {t('weeks.locked')}
          </span>
        ) : (
          <Link
            to={`/weeks/${week.id}`}
            className="group flex items-center gap-2 rounded-full bg-brand-primary text-brand-background px-4 py-1.5 transition text-sm font-semibold hover:bg-opacity-90"
          >
            {t('weeks.enter')}
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        )}
      </div>
      {isLocked && (
        <div className="pointer-events-none absolute inset-0 rounded-20 bg-black/50 backdrop-blur-sm"></div>
      )}
    </div>
  );
}

export default function Weeks() {
  const { t } = useTranslation();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeeks = async () => {
      setLoading(true);
      try {
        const data = await weekService.getAllWeeks();
        setWeeks(data.sort((a, b) => a.week_number - b.week_number));
        setError('');
      } catch (err) {
        setError(t('weeks.errors.fetch'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();
  }, [t]);

  if (loading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (error) {
    return (
        <Section title={t('weeks.title')}>
            <p className="text-center text-red-400">{error}</p>
        </Section>
    );
  }

  return (
    <Section id="weeks" title={t('weeks.title')}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week) => (
          <WeekCard key={week.id} week={week} />
        ))}
      </div>
    </Section>
  );
}