import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api, { classService } from "../../services/api";
import { Plus, Trash2, Edit } from "lucide-react";
import LoadingScreen from "../../components/LoadingScreen";
import Modal from "../../components/Modal";

const ClassManagement = () => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(t("classManagement.errors.fetch"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const openModal = (cls = null) => {
    setEditingClass(cls);
    setFormData(cls ? { name: cls.name } : { name: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const errorKey = editingClass ? "classManagement.errors.update" : "classManagement.errors.add";
    try {
      if (editingClass) {
        await api.put(`/admin/classes/${editingClass.id}`, formData);
      } else {
        await classService.createClass(formData);
      }
      fetchClasses();
      closeModal();
    } catch (err) {
      setError(t(errorKey));
      console.error(err);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm(t("classManagement.confirmDelete"))) {
      try {
        await classService.deleteClass(classId);
        fetchClasses();
      } catch (err) {
        setError(t("classManagement.errors.delete"));
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t("classManagement.title")}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200"
        >
          <Plus size={20} /> {t("classManagement.addClass")}
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

      {isLoading ? (
        <LoadingScreen fullScreen={false} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-black/20 border border-brand-border rounded-20 p-5 flex justify-between items-center transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1"
            >
              <span className="text-lg font-semibold">{cls.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => openModal(cls)}
                  className="text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="text-brand-secondary hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClass ? t('classManagement.editClass') : t('classManagement.addClass')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-secondary mb-2">{t('classManagement.newClassName')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder={t('classManagement.newClassName')}
              required
              className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.cancel')}</button>
            <button type="submit" className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors">{t('common.save')}</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ClassManagement;