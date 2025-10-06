import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-[9999] overflow-y-auto py-10"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 w-full max-w-3xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;