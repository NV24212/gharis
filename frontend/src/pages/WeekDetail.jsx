import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Video } from 'lucide-react';

const WeekDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const [week, setWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeekDetail = async () => {
      if (!token) {
        setError(t('Authentication required.'));
        setLoading(false);
        return;
      }
      setAuthToken(token);

      try {
        setLoading(true);
        const response = await api.get(`/weeks/${id}`);
        setWeek(response.data);
        setError('');
      } catch (err) {
        setError(t('Failed to fetch week details.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekDetail();
  }, [id, token, t]);

  const Card = ({ title, description, className = '' }) => (
    <div className={`bg-brand-content border border-brand-border rounded-2xl p-6 shadow-card transition-transform hover:-translate-y-1 ${className}`}>
      <h3 className="text-brand-primary font-bold text-xl mb-2">{title}</h3>
      <p className="text-brand-secondary leading-relaxed">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-secondary">{t('Fetching week details...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-secondary">{t('Week not found.')}</p>
      </div>
    );
  }

  // Split cards for layout purposes
  const [card1, card2, card3, card4] = week.content_cards;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-primary">
          {t('Week')} {week.week_number}: {week.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column card */}
        {card1 && (
          <div className="lg:col-span-1 flex items-center">
            <Card title={card1.title} description={card1.description} className="w-full" />
          </div>
        )}

        {/* Center column with Video and a card below */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-content border border-brand-border rounded-2xl shadow-card overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                src={week.video_url}
                title={`فيديو ${week.title}`}
                allow="autoplay; encrypted-media"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="p-4 text-center text-sm">
              <a href={week.video_url} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center justify-center gap-2">
                <Video size={16} /> {t('Open video in new tab')}
              </a>
            </div>
          </div>
          {card2 && <Card title={card2.title} description={card2.description} />}
        </div>

        {/* Right column with two cards */}
        <div className="lg:col-span-1 space-y-6">
            {card3 && <Card title={card3.title} description={card3.description} />}
            {card4 && <Card title={card4.title} description={card4.description} />}
        </div>
      </div>
       <div className="text-center mt-12">
          <Link to="/weeks" className="text-brand-accent hover:underline flex items-center justify-center gap-2">
            <span>العودة إلى قائمة الأسابيع</span>
            <ArrowRight size={20} />
          </Link>
        </div>
    </div>
  );
};

export default WeekDetail;