import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { addUserDetails, logoutUser } from "../../features/UserSlice";
import { SlCalender } from "react-icons/sl";
import { PiStudentBold } from "react-icons/pi";
import { MdBrowserUpdated } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import Modal from "../Common/Modal";
import { Si1Password } from "react-icons/si";
import { MdUpdate } from "react-icons/md";

const StudentNav = () => {
  let token = Cookies.get("token");
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [isModalVisible, setModalVisible] = useState(false);

  // Function to handle the toggle of the sidebar
  const toggleSidebar = () => {
    const sidebar = document.getElementById("docs-sidebar");
    sidebar.classList.toggle("translate-x-0");
    sidebar.classList.toggle("-translate-x-full");
  };

  let id = useSelector((state) => state.User.id);
  let userId = useSelector((state) => state.User.user_id);

  const handleLogout = (e) => {
    e.preventDefault();
    Cookies.remove("token");
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      dispatch(addUserDetails({ token: token }));
    }
  }, [dispatch, token]);

  return (
    <div className="h-[100vh]">
      {/* Button to toggle the sidebar */}
      <button
        type="button"
        className=" text-gray-500 hover:text-gray-600 mt-5 ms-5 lg:hidden"
        onClick={toggleSidebar}
        aria-controls="docs-sidebar"
        aria-label="Toggle navigation"
      >
        <span className="sr-only">Toggle Navigation</span>
        <svg
          className="flex-shrink-0 w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        id="docs-sidebar"
        className="fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 lg:hidden">
          <span className="text-xl font-semibold">ID: {userId}</span>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 4a1 1 0 011.707-.707L10 5.586l2.293-2.293A1 1 0 1113.707 4L11.414 6.293 13.707 8.586A1 1 0 0112.293 10L10 7.707 7.707 10A1 1 0 116 8.586L8.293 6.293 6 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <Link
            className="block text-xl font-semibold text-gray-900"
            href="#"
            aria-label="Logo"
          >
            <img
              className="w-35 h-8 md:w-40 md:h-12 lg:h-10 2xl:h-full 2xl:w-full"
              src="/src/assets/Chandigarh Engineering College Full Logo.png"
              alt="logo"
            />
          </Link>
        </div>
        <nav className="px-6 py-4 space-y-1 flex flex-col justify-between h-[82vh] md:h-[85vh] lg:h-[88vh] xl:h-[90vh]">
          <ul>
            <li>
              <NavLink
                to={`/student/${id}/attendance`}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-2 text-sm rounded-lg hover:bg-gray-100 ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  }`
                }
              >
                <SlCalender />
                Attendance
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/student/${id}/details`}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-2 text-sm rounded-lg hover:bg-gray-100 ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  }`
                }
              >
                <PiStudentBold />
                Student Details
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/student/${id}/updateDetails`}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-2 text-sm rounded-lg hover:bg-gray-100 ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  }`
                }
              >
                <MdBrowserUpdated />
                Update Student Details
              </NavLink>
            </li>
            <li className="relative group">
              <button
                type="button"
                className="flex items-center justify-between w-full p-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 group-hover:bg-gray-100"
              >
                <span className="flex items-center gap-4">
                  <FaKey />
                  Privacy
                </span>
                <svg
                  className="w-4 h-4 transition-transform transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <ul className="pl-8 mt-1 space-y-1 overflow-hidden transition-max-height max-h-0 group-hover:max-h-40">
                <li>
                  <NavLink
                    to={`/student/${id}/updatePassword`}
                    className={({ isActive }) =>
                      `flex items-center gap-4 p-2 text-sm rounded-lg hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                      }`
                    }
                  >
                    <MdUpdate /> Update Password
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/student/${id}/forgetPassword`}
                    className={({ isActive }) =>
                      `flex items-center gap-4 p-2 text-sm rounded-lg hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                      }`
                    }
                  >
                    <Si1Password /> Forget Password
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
          <div>
            <button
              type="button"
              onClick={() => setModalVisible(true)}
              className="flex items-center gap-4 p-2 mt-auto text-sm text-red-600 rounded-lg hover:bg-red-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2h-6a2 2 0 01-2-2v-14a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onYes={handleLogout}
        onNo={() => setModalVisible(false)}
        title="Confirm Logout"
        desc={"Are you sure you want to log out?"}
      />
    </div>
  );
};

export default StudentNav;
