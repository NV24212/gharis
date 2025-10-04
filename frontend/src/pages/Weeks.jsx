import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Section from '../components/Section.jsx';

function WeekCard({ week }) {
  const isLocked = !week.unlocked;
  return (
    <div className="relative rounded-20 border border-gray-700 bg-gray-800 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold">الأسبوع {week.week_number}</h3>
          <p className="text-gray-400 mt-1">{week.title || 'قيمة لاحقًا'}</p>
        </div>
        {isLocked ? (
          <span className="rounded-full border border-gray-600 text-gray-400 px-3 py-1 cursor-not-allowed select-none text-sm">
            مغلق
          </span>
        ) : (
          <Link
            to={`/weeks/${week.id}`}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-500 transition text-sm"
          >
            ادخل
          </Link>
        )}
      </div>
      {isLocked && (
        <div className="pointer-events-none absolute inset-0 rounded-20 bg-black/40 backdrop-blur-sm"></div>
      )}
    </div>
  );
}

export default function Weeks() {
  const { token } = useContext(AuthContext);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeeks = async () => {
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }
      setAuthToken(token);

      try {
        setLoading(true);
        const response = await api.get('/weeks');
        setWeeks(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch weeks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();
  }, [token]);

  if (loading) {
    return <Section title="الأسابيع"><p className="text-center text-white">Loading weeks...</p></Section>;
  }

  if (error) {
    return <Section title="الأسابيع"><p className="text-center text-red-500">{error}</p></Section>;
  }

  return (
    <Section id="weeks" title="الأسابيع">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week) => (
          <WeekCard key={week.id} week={week} />
        ))}
      </div>
    </Section>
  );
}