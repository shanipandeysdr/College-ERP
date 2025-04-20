import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const BackButton = ({ targetRoute }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(targetRoute);
  };

  return (
    <button
      onClick={handleBack}
      className="block lg:absolute top-5 start-5 gap-2 bg-gray-300 hover:bg-red-400 font-oswald py-2 px-5 rounded-md font-bold"
    >
      <div className="flex items-center gap-2">
        <MdArrowBack /> Back
      </div>
    </button>
  );
};

export default BackButton;
