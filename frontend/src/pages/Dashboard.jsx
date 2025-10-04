import React, { useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setLoading(false);
        setError('No authentication token found.');
        return;
      }
      setAuthToken(token);

      try {
        setLoading(true);
        const response = await api.get('/students/me');
        setStudent(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch student data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">No student data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          Welcome, {student.name}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400">Class</p>
            <p className="text-white font-semibold">{student.class_name}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400">Total Points</p>
            <p className="text-white font-semibold">{student.points}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;