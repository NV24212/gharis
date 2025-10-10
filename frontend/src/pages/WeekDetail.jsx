import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const WeekDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [week, setWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeekDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/weeks/${id}`);
        setWeek(response.data);
        setError('');
      } catch (err) {
        setError(t('weekDetail.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekDetail();
  }, [id, t]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 p-8">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-brand-secondary p-8">
        <p>{t('weekDetail.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary">
          {t('weeks.week')} {week.week_number}: {week.title}
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="w-full max-w-sm mx-auto">
          <div className="aspect-w-9 aspect-h-16 bg-black rounded-20 overflow-hidden border border-brand-border shadow-card">
            {week.video_url ? (
              <video
                src={week.video_url}
                controls
                className="w-full h-full object-cover"
                poster="" // Optional: Add a poster image
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center text-brand-secondary">
                {t('weekDetail.videoTitle')}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="grid gap-6">
            {week.content_cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-black/20 border border-brand-border rounded-20 p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-brand-primary/40"
              >
                <h3 className="text-2xl text-brand-primary font-bold mb-3">{card.title}</h3>
                {card.description && <p className="text-brand-secondary text-lg">{card.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekDetail;