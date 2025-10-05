import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { classService } from "../../services/api";
import { Plus, Trash2 } from "lucide-react";
import LoadingScreen from "../../components/LoadingScreen";

const ClassManagement = () => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      await classService.createClass({ name: newClassName });
      setNewClassName("");
      fetchClasses();
    } catch (err) {
      setError(t("classManagement.errors.add"));
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
      <h1 className="text-3xl font-bold mb-8 text-brand-primary">{t("classManagement.title")}</h1>

      {error && <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleAddClass} className="mb-8 flex items-center gap-4 bg-black/20 border border-brand-border p-4 rounded-20">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder={t("classManagement.newClassName")}
          className="flex-grow p-3 bg-transparent text-brand-primary rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          {t("classManagement.addClass")}
        </button>
      </form>

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
              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="text-brand-secondary hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ClassManagement;