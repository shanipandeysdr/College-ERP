const Course = require("../models/Course");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// get Courses
const getCourses = async (req, res) => {
  try {
    let courses = await Course.find();

    return res.json({ success: true, data: courses });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

// get Subjects from course
const getSubjectes = async (req, res) => {
  try {
    let { courseId } = req.params;

    let course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const subjects = course.subjects;

    res.json({ success: true, subjects });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

// get teachers form subjects
const getTeachersFromSub = async (req, res) => {
  try {
    const { courseId, subjectId } = req.params;

    // Find course by ID and populate the specific subject's teachers
    const course = await Course.findById(courseId).populate({
      path: "subjects",
      match: { _id: subjectId },
      populate: { path: "teacher", model: "Teacher" },
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const subject = course.subjects.find(
      (sub) => sub._id.toString() === subjectId
    );

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    const teachers = subject.teacher;

    res.json({ success: true, teachers });
  } catch (err) {
    console.error("Error fetching teachers: ", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getStudentsFromCourse = async (req, res) => {
  try {
    let { courseId } = req.params;

    let course = await Course.findById(courseId).populate("students");

    if (!course) {
      res.status(404).json({ success: false, msg: "Course Not Found" });
    }

    const students = course.students;

    res.status(200).json({ success: true, students });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

// add Course
const addCourse = async (req, res) => {
  try {
    const { courseName, subjects, students } = req.body;

    const existingCourse = await Course.findOne({ courseName });

    if (existingCourse) {
      return res
        .status(400)
        .json({ success: false, msg: "Course Already Exist" });
    }

    const newCourse = await Course.create({
      courseName,
      subjects: subjects || [],
      students: students || [],
    });

    return res.status(201).json({
      success: true,
      msg: "Course Added Successfully",
      course: newCourse,
    });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { courseId, studentIds } = req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    const students = await Student.find({ student_id: { $in: studentIds } });
    if (students.length !== studentIds.length) {
      return res
        .status(400)
        .json({ success: false, msg: "One or more students not found" });
    }

    const studentObjectIds = students.map((student) => student._id);
    course.students.push(...studentObjectIds);

    await course.save();

    return res.status(200).json({
      success: true,
      msg: "Students added to the course successfully",
      course,
    });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

const enrollTeacher = async (req, res) => {
  try {
    const { courseId, teacherId, subjectId } = req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    let teacher = await Teacher.findOne({ teacher_Id: teacherId });

    if (!teacher) {
      return res.status(404).json({ success: false, msg: "Teacher Not Found" });
    }

    const subject = course.subjects.id(subjectId);

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, msg: "Subject not found in this course" });
    }

    if (subject.teacher.includes(teacher._id)) {
      return res.status(400).json({
        success: false,
        msg: "Teacher already assigned to this subject",
      });
    }

    subject.teacher.push(teacher._id);

    await course.save();

    return res.status(200).json({
      success: true,
      msg: "Teacher assigned to subject successfully",
      course,
    });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

const mongoose = require("mongoose");

const addAttendance = async (req, res) => {
  try {
    const { courseId, subjectId, attendanceRecords, date } = req.body;
    const teacherID = req.user.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Invalid Course ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid Subject ID" });
    }
    for (const record of attendanceRecords) {
      if (!mongoose.Types.ObjectId.isValid(record.studentId)) {
        return res.status(400).json({
          success: false,
          msg: `Invalid Student ID: ${record.studentId}`,
        });
      }
    }

    const AttendanceDate = new Date(date);
    if (isNaN(AttendanceDate)) {
      return res.status(400).json({ success: false, msg: "Invalid Date" });
    }

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    let subject = course.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject not found" });
    }

    if (!subject.teacher.includes(teacherID)) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized: You are not assigned to this subject",
      });
    }

    // Ensure attendanceRecords is an array
    if (!Array.isArray(attendanceRecords)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid attendanceRecords format" });
    }

    attendanceRecords.forEach(({ studentId }) => {
      let attendance = subject.attendance.find(
        (att) => att.student.toString() === studentId
      );

      if (attendance) {
        if (!attendance.dates.includes(AttendanceDate)) {
          attendance.dates.push(AttendanceDate);
        }
      } else {
        subject.attendance.push({
          student: studentId,
          dates: [AttendanceDate],
        });
      }
    });

    await course.save();

    return res.status(201).json({
      success: true,
      msg: "Attendance added successfully",
    });
  } catch (err) {
    console.log("Something went wrong:", err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

// delete student
const deleteStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course Not Found" });
    }

    // .equal method compare values using == and .stricEqual compare using ===
    // in below step we are removing studet from student array in course
    course.students = course.students.filter((stud) => !stud.equals(studentId));

    // Removing student from each subject stdent's attendance array
    course.subjects.forEach((subject) => {
      // Filter attendance records that belong to the student
      subject.attendance = subject.attendance.filter(
        (attendance) => !attendance.student.equals(studentId)
      );
    });

    await course.save();

    return res.status(200).json({
      success: true,
      msg: "Student removed from course and subjects successfully",
      course,
    });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

// remove teacher from course
const deleteTeacher = async (req, res) => {
  try {
    let { courseId, teacherId, subjectId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course Not Found" });
    }

    const subject = course.subjects.id(subjectId);

    if (!subject) {
      return res.status(404).json({ success: false, msg: "Subject Not Found" });
    }

    subject.teacher = subject.teacher.filter((teacher) => {
      !teacher.equals(teacherId);
    });

    await course.save();

    return res.status(200).json({
      success: true,
      msg: "Teacher removed from the subject successfully",
      course,
    });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

// deleteCourse
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course Not Found" });
    }

    await Student.updateMany({ course: courseId }, { $unset: { course: "" } });

    await course.deleteOne();

    return res
      .status(200)
      .json({ success: true, msg: "Course Deleted Successfully" });
  } catch (err) {
    console.log("Something Went Wrong:", deleteCourse);
  }
};

module.exports = {
  getCourses,
  getSubjectes,
  getTeachersFromSub,
  getStudentsFromCourse,
  addCourse,
  enrollStudent,
  enrollTeacher,
  addAttendance,
  deleteStudent,
  deleteTeacher,
  deleteCourse,
};
