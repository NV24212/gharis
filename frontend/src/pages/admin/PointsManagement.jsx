import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api, { classService } from '../../services/api';
import { Loader2, PlusCircle, MinusCircle, Search, ChevronDown } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';

const PointsManagement = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState('add'); // 'add' or 'deduct'
  const [points, setPoints] = useState('');

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/admin/students'),
        classService.getAllClasses(),
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes);
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

  const filteredStudents = useMemo(() => {
    return students
      .filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(student => {
        if (!classFilter) return true;
        return student.class_id === parseInt(classFilter);
      });
  }, [students, searchTerm, classFilter]);

  const openModal = (student, type) => {
    setSelectedStudent(student);
    setActionType(type);
    setIsModalOpen(true);
    setPoints('');
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    if (!points || !selectedStudent) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const pointsValue = actionType === 'deduct' ? -Math.abs(Number(points)) : Math.abs(Number(points));

    try {
      await api.post(`/admin/students/${selectedStudent.id}/add-points`, { points: pointsValue });
      const successMessage = actionType === 'add'
        ? t('pointsManagement.success.add', { points: pointsValue, studentName: selectedStudent.name })
        : t('pointsManagement.success.deduct', { points: Math.abs(pointsValue), studentName: selectedStudent.name });

      setSuccess(successMessage);

      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === selectedStudent.id
            ? { ...student, points: student.points + pointsValue }
            : student
        )
      );

      closeModal();
    } catch (err) {
      setError(t('pointsManagement.errors.addPoints'));
      console.error(err);
      fetchStudents(); // Re-fetch on error to ensure data consistency
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen fullScreen={false} />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('pointsManagement.title')}</h1>
        <div className="flex items-center gap-4">
            <div className="relative">
                <label htmlFor="classFilter" className="sr-only">{t('userManagement.filterByClass')}</label>
                <select
                id="classFilter"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-black/30 border border-brand-border text-brand-primary p-3 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none"
                >
                <option value="">{t('userManagement.allClasses')}</option>
                {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
                    <ChevronDown className="h-5 w-5 text-brand-secondary" />
                </div>
            </div>
            <div className="relative w-full max-w-xs">
                <input
                    type="text"
                    placeholder={t('pointsManagement.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-brand-secondary" />
                </div>
            </div>
        </div>
      </div>

      {error && !isModalOpen && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-6">{success}</div>}

      <div className="bg-black/20 border border-brand-border rounded-20 overflow-hidden">
        <table className="min-w-full text-brand-primary">
          <thead className="bg-brand-border/5">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.name')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.class')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.points')}</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">{t('studentManagement.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-brand-border/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.class?.name || <span className="text-brand-secondary">{t('studentManagement.form.unassigned')}</span>}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.points}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-6">
                    <button onClick={() => openModal(student, 'add')} className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2">
                      <PlusCircle size={20} />
                      <span>{t('pointsManagement.add')}</span>
                    </button>
                    <button onClick={() => openModal(student, 'deduct')} className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2">
                      <MinusCircle size={20} />
                       <span>{t('pointsManagement.deduct')}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${t(actionType === 'add' ? 'pointsManagement.add' : 'pointsManagement.deduct')} ${t('pointsManagement.titleFor')} ${selectedStudent?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePointsSubmit} className="space-y-4">
          {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-brand-secondary mb-2">
              {t('pointsManagement.pointsTo', { context: actionType })}
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button
              type="submit"
              className={`font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center w-28 ${actionType === 'add' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.confirm')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PointsManagement;