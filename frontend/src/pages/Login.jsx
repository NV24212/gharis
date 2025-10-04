import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Key, LogIn } from 'lucide-react';
import { logoUrl } from '../data/site.js';

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
      // The backend's OAuth2 form dependency expects a username, even if it's not used in the logic.
      formData.append('username', 'user');

      const response = await api.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const token = response.data.access_token;
      login(token);

      const decoded = jwtDecode(token);
      navigate(decoded.role === 'admin' ? '/admin' : '/dashboard');

    } catch (err) {
      setError(t('Invalid password or server error.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-background p-4">
      <div className="w-full max-w-sm">
         <div className="text-center mb-8">
            <img src={logoUrl} alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-4"/>
            <h1 className="text-2xl font-bold text-brand-primary">{t('Sign in to your account')}</h1>
            <p className="text-brand-secondary mt-2">{t('Enter your password to access the platform.')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('Password')}
              className="w-full bg-brand-content border border-brand-border text-brand-primary p-3 pr-10 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
            />
            <Key className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-brand-secondary" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 font-bold text-brand-background bg-brand-accent rounded-lg transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : t('Sign In')}
              {!loading && <LogIn size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;