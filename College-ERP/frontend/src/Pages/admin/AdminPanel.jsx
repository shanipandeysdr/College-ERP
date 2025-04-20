import React from "react";
import { Link } from "react-router-dom";
import BackButton from "../../components/back";

const AdminPanel = () => {
  let options = [
    {
      name: "Add Course",
      option: "addCourse",
    },
    {
      name: "Add Student",
      option: "addStudent",
    },
    {
      name: "Add Teacher",
      option: "addTeacher",
    },
    {
      name: "Assign Teacher",
      option: "assignTeacher",
    },
    // {
    //   name: "Enroll Student",
    //   option: "enrollStudent",
    // },
    {
      name: "Remove Teacher From Course",
      option: "removeTeacherFromCourse",
    },
    {
      name: "Remove Student From Course",
      option: "removeStudentFromCourse",
    },
    {
      name: "Delete Course",
      option: "deleteCourse",
    },
    {
      name: "Delete Teacher",
      option: "deleteTeacher",
    },
    {
      name: "Delete Student",
      option: "deleteStudent",
    },
  ];

  return (
    <>
      <div className="flex flex-col w-full py-10">
        <div className="ms-5 mt-5 lg:mt-0 lg:ms-0">
          <BackButton targetRoute={"/"} />
        </div>

        <h1 className="cursor-default overflow-y-hidden text-center text-5xl md:text-8xl text-blue-500 font-extrabold font-oswald">
          Admin Panel
        </h1>
      </div>
      <div className="flex overflow-hidden flex-wrap justify-evenly gap-11 w-full px-11 md:px-20 lg:px-28 xl:px-44 md:mt-20 mb-10">
        {options?.map((item, index) => {
          return (
            <Link
              className="cursor-pointer bg-blue-500 text-white font-bold text-2xl text-center rounded-md flex justify-center items-center w-80 h-44 hover:scale-105 transition hover:bg-blue-400 overflow-hidden font-openSans shadow-xl shadow-gray-300"
              to={`/admin/adminPanel/${item.option}`}
              key={index}
            >
              <h3>{item.name}</h3>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default AdminPanel;
