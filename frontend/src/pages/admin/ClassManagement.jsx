import React, { useState, useEffect } from "react";
import { classService } from "../../services/api";
import { Plus, Trash2 } from "lucide-react";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      setError("Failed to fetch classes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      await classService.createClass({ name: newClassName });
      setNewClassName("");
      fetchClasses(); // Refresh the list
    } catch (err) {
      setError("Failed to add class.");
      console.error(err);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.deleteClass(classId);
        fetchClasses(); // Refresh the list
      } catch (err) {
        setError("Failed to delete class.");
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 bg-brand-background text-brand-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">إدارة الفصول</h1>

      {error && <p className="text-red-500 bg-red-900 border border-red-700 p-3 rounded-lg mb-6">{error}</p>}

      <form onSubmit={handleAddClass} className="mb-8 flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="اسم الفصل الجديد"
          className="flex-grow p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none"
        />
        <button
          type="submit"
          className="bg-brand-primary text-white p-3 rounded-md hover:bg-opacity-80 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          إضافة فصل
        </button>
      </form>

      {isLoading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
              <span className="text-lg">{cls.name}</span>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassManagement;