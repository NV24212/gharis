import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { Loader2, Plus } from 'lucide-react';

const PointsManagement = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [points, setPoints] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data);
    } catch (err) {
      setError(t('pointsManagement.errors.fetchStudents'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !points) {
      setError(t('pointsManagement.errors.fillFields'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/admin/students/${selectedStudent}/add-points`, { points: Number(points) });
      setSuccess(t('pointsManagement.success', { points, studentName: students.find(s => s.id === parseInt(selectedStudent))?.name }));
      setPoints('');
      // Optionally, refresh student list or points display if needed
    } catch (err) {
      setError(t('pointsManagement.errors.addPoints'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-primary mb-8">{t('pointsManagement.title')}</h1>

      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-black/20 border border-brand-border rounded-20 p-8 space-y-6">
        <div>
          <label htmlFor="student" className="block text-sm font-medium text-brand-secondary mb-2">
            {t('pointsManagement.selectStudent')}
          </label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          >
            <option value="">{t('pointsManagement.selectStudentPlaceholder')}</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="points" className="block text-sm font-medium text-brand-secondary mb-2">
            {t('pointsManagement.pointsToAdd')}
          </label>
          <input
            type="number"
            id="points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-background font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
            {isSubmitting ? t('pointsManagement.submitting') : t('pointsManagement.submitButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PointsManagement;