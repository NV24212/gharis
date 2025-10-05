import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Section from '../components/Section.jsx';

export default function WeekDetail() {
  const { id } = useParams();
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
        setError('Failed to fetch week details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekDetail();
  }, [id]);

  if (loading) {
    return <Section title="Loading..."><p className="text-center text-white">Fetching week details...</p></Section>;
  }

  if (error) {
    return <Section title="Error"><p className="text-center text-red-500">{error}</p></Section>;
  }

  if (!week) {
    return <Section title="Not Found"><p className="text-center text-white">Week not found.</p></Section>;
  }

  return (
    <Section id={`week${week.id}`} title={`الأسبوع ${week.week_number}: ${week.title}`}>
      <div className="grid gap-8 lg:grid-cols-2" data-animate>
        {/* Video */}
        <div className="rounded-20 overflow-hidden border border-gray-700 shadow-lg">
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
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 text-center text-gray-400 text-sm">
            <a href={week.video_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              فتح الفيديو في نافذة جديدة
            </a>
          </div>
        </div>

        {/* Cards */}
        <div>
          <div className="grid gap-6 sm:grid-cols-2">
            {week.content_cards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-20 border border-gray-700 bg-gray-800 p-5 shadow-lg hover:translate-y-[-2px] hover:border-blue-500/50 transition"
              >
                <h3 className="text-white font-bold mb-2">{card.title}</h3>
                {card.description && <p className="text-gray-400">{card.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}