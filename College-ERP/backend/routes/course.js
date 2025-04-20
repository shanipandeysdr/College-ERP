const express = require("express");
const {
  addCourse,
  addAttendance,
  enrollStudent,
  enrollTeacher,
  deleteStudent,
  deleteTeacher,
  deleteCourse,
  getCourses,
  getSubjectes,
  getTeachersFromSub,
  getStudentsFromCourse,
} = require("../controller/course");
const { isTeacher, isAdmin } = require("../middleware/Auth");

const router = express.Router();

// get course
router.get("/", getCourses);
// get subjects from course
router.get("/:courseId/subjects", getSubjectes);
// get teachers from subject
router.get("/:courseId/subjects/:subjectId/teachers", getTeachersFromSub);
// get Students from course
router.get("/:courseId/students", getStudentsFromCourse);
// add course --admin
router.post("/addCourse", addCourse);
// add student to course --amin
router.post("/enrollStudents", isAdmin, enrollStudent);
// add teacher to course --admin
router.post("/assignTeacher", isAdmin, enrollTeacher);
// add attendance --teacher
router.post("/course/attendance", isTeacher, addAttendance);
// delete sutdent from course --admin
router.delete("/removeStudentFromCourse", isAdmin, deleteStudent);
// delete Teacher from course --admin
router.delete("/removeTeacherFromCourse", isAdmin, deleteTeacher);
// delete Course --admin
router.delete("/:courseId/deleteCourse", isAdmin, deleteCourse);

module.exports = router;
