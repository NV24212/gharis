import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api, { setAuthToken } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { KeyRound } from 'lucide-react';
import { logoUrl } from '../data/site';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('password', password);
      formData.append('username', 'user'); // Dummy username as backend expects it

      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = response.data.access_token;
      login(token); // Update context
      setAuthToken(token); // Set token for subsequent requests

      const decoded = jwtDecode(token);
      navigate(decoded.role === 'admin' ? '/admin' : '/dashboard');

    } catch (err) {
      setError(t('login.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-brand-background font-arabic p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
            <img src={logoUrl} alt="Logo" className="h-20 w-20 rounded-full object-cover" />
        </div>
        <div className="bg-black/40 border border-brand-border rounded-20 shadow-card p-8 backdrop-blur-lg">
          <h1 className="text-2xl font-bold text-center text-brand-primary mb-6">{t('login.title')}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t('login.passwordLabel')}
              </label>
              <KeyRound className="absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-brand-secondary" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                className="w-full pl-10 pr-3 py-2.5 text-brand-primary bg-brand-background/50 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all duration-300"
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center animate-fade-in-up">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 font-semibold text-brand-background bg-brand-primary rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background focus:ring-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : t('login.submitButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;