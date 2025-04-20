import React from "react";

const Modal = ({ isVisible, onClose, onYes, onNo, title, desc, note }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg mx-4 md:mx-auto rounded-lg shadow-lg p-6 relative z-30">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div className="mb-4">{desc}</div>
        <div className="mb-4 text-sm">{note}</div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={onNo}
          >
            No
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={onYes}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
