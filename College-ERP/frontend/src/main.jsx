import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./app/Store";
import Layout from "./Layout";
import Login from "./Pages/Common/Login";
import Attendance from "./Pages/Student/Attendance";
import Courses from "./Pages/Teacher/Courses";
import AdminPanel from "./Pages/admin/AdminPanel";
import Unauth from "./Pages/admin/Unauth";
import AddStudent from "./Pages/admin/AddStudent";
import AddTeacher from "./Pages/admin/AddTeacher";
import AddCourse from "./Pages/admin/AddCourse";
import AssignTeacher from "./Pages/admin/AssignTeacher";
import DeleteTeacherFromCourse from "./Pages/admin/DeleteTeacherFromCourse";
import RemoveStudentFormCourse from "./Pages/admin/RemoveStudentFormCourse";
import DeleteCourse from "./Pages/admin/DeleteCourse";
import DeleteTeacher from "./Pages/admin/DeleteTeacher";
import DeleteStudent from "./Pages/admin/DeleteStudent";

import StudentDetails from "./Pages/Student/StudentDetails";
import UpdateStudentdDetails from "./Pages/Student/UpdateStudentdDetails";
import UpdatePass from "./Pages/Common/UpdatePass";
import Subjects from "./Pages/Teacher/Subjects";
import MarkAttendance from "./Pages/Teacher/MarkAttendance";
import TeacherDetails from "./Pages/Teacher/TeacherDetails";
import ForgetPass from "./Pages/Common/ForgetPassword/ForgetPass";
import VerifyOtp from "./Pages/Common/ForgetPassword/VerifyOtp";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* home route */}
      <Route index element={<Login />} />
      {/* student routes */}
      <Route path="student/:id">
        <Route path="attendance" element={<Attendance />} />
        <Route path="details" element={<StudentDetails />} />
        <Route path="updateDetails" element={<UpdateStudentdDetails />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* teacher routes */}
      <Route path="teacher/:id">
        <Route path="courses" element={<Courses />} />
        <Route
          path="courses/course/:courseId/subjects"
          element={<Subjects />}
        />
        <Route
          path="courses/course/:courseId/subjects/subject/:subId/markAttendance"
          element={<MarkAttendance />}
        />
        <Route path="details" element={<TeacherDetails />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* admin routes */}
      <Route path="admin">
        <Route path="adminPanel" element={<AdminPanel />} />
        <Route path="adminPanel/addStudent" element={<AddStudent />} />
        <Route path="adminPanel/addTeacher" element={<AddTeacher />} />
        <Route path="adminPanel/addCourse" element={<AddCourse />} />
        <Route path="adminPanel/assignTeacher" element={<AssignTeacher />} />
        <Route
          path="adminPanel/removeTeacherFromCourse"
          element={<DeleteTeacherFromCourse />}
        />
        <Route
          path="adminPanel/removeStudentFromCourse"
          element={<RemoveStudentFormCourse />}
        />
        <Route path="adminPanel/deleteCourse" element={<DeleteCourse />} />
        <Route path="adminPanel/deleteTeacher" element={<DeleteTeacher />} />
        <Route path="adminPanel/deleteStudent" element={<DeleteStudent />} />
      </Route>
      {/* unauthorized */}
      <Route path="/unauthorized" element={<Unauth />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      bodyClassName="toastBody"
    />
  </Provider>
);
