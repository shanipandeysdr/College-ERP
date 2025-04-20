const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const cloudinary = require("../utils/cloudinary");
const nodemailer = require("nodemailer");

const getStudents = (req, res) => {
  res.send("This is getstudent page");
};

// get student Details
const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    let student = await Student.findById(studentId).populate("course");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Studnet Not Found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Student Details Fethched Successfully",
      student,
    });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

// make it admin route
// register Student
const addStudent = async (req, res) => {
  try {
    const {
      student_id,
      first_name,
      last_name,
      email,
      password,
      dob,
      gender,
      address,
      phone,
      course,
    } = req.body;

    let existingStud = await Student.findOne({ student_id });

    if (existingStud) {
      return res
        .status(400)
        .json({ success: false, msg: "Student Already Exist" });
    }

    const salt = 10;
    const hashPass = await bcrypt.hash(password, salt);

    const newStudent = {
      student_id,
      first_name,
      last_name,
      email: email.trim(),
      password: hashPass,
      dob,
      gender,
      address,
      phone: phone.trim(),
      course,
      role: "student",
    };

    let student = await Student.create(newStudent);

    // update the course

    if (course) {
      let enrolledCourse = await Course.findById(course);

      if (enrolledCourse) {
        enrolledCourse.students.push(student._id);
        await enrolledCourse.save();
      } else {
        return res.status(404).json({
          success: false,
          msg: "Course Not Found",
        });
      }
    }

    return res.status(201).json({
      success: true,
      msg: "Student added Successfully",
      student: student,
    });
  } catch (err) {
    console.log("Something went wrong: ", err);
  }
};

// login Student
const loginStudent = async (req, res) => {
  try {
    const { student_id, password } = req.body;

    let student = await Student.findOne({ student_id });

    if (!student) {
      return res
        .status(400)
        .json({ success: false, msg: "User Does Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: student._id,
        user_id: student.student_id,
        name: student.name,
        role: student.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    return res
      .status(201)
      .json({ success: true, msg: "Login Successfull", token });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

// upadte password
const updatePass = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    const { currpass, newpass, confirmpass } = req.body;

    if (!(await bcrypt.compare(currpass, student.password))) {
      return res
        .status(400)
        .json({ success: false, msg: "incorrect password" });
    }

    if (newpass !== confirmpass) {
      return res.status(400).json({
        success: false,
        msg: "New Password and Confirm Password do not match",
      });
    }

    const salt = 10;
    const hashpass = await bcrypt.hash(newpass, salt);

    student.password = hashpass;

    await student.save();

    return res
      .status(200)
      .json({ success: true, msg: "Password Upadated Successfully" });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

// delete Student
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await Student.findOne({ student_id: studentId });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student Not Found" });
    }

    const studentID = student._id;
    const course = await Course.findById(student.course);

    if (course) {
      // Update students in the course
      course.students = course.students.filter(
        (stud) => !stud.equals(studentID)
      );

      // Update attendance records in subjects
      course.subjects.forEach((subject) => {
        subject.attendance = subject.attendance.filter(
          (attendance) => !attendance.student.equals(studentID)
        );
      });

      await course.save();
    }

    await student.deleteOne();

    return res.status(200).json({
      success: true,
      msg: "Student Deleted and Removed from Course and Subjects Successfully",
    });
  } catch (err) {
    console.error("Something went wrong", err);
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// get student attendace
const getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student and populate the 'courses' field
    const student = await Student.findById(id).populate("course").exec();

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student Not Found" });
    }

    // Ensure 'courses' is an array of course documents
    const courses = Array.isArray(student.course)
      ? student.course
      : [student.course];

    let subjectAttendance = {};
    let totalPresentDays = 0;
    let totalDays = 0;

    // Iterate over each enrolled course of the student
    for (let enrolledCourse of courses) {
      const course = await Course.findById(enrolledCourse._id);

      if (!course) {
        continue; // Skip to the next course if course is not found
      }

      // Iterate over each subject in the course
      for (let subject of course.subjects) {
        const subjectId = subject._id.toString();
        let presentCount = 0;
        const totalClasses = 120;

        // Iterate over each attendance entry for the subject
        subject.attendance.forEach((entry) => {
          if (entry.student.toString() === student._id.toString()) {
            presentCount += entry.dates.length;
          }
        });

        // Calculate attendance percentage for the subject
        const attendancePercentage = (
          (presentCount / totalClasses) *
          100
        ).toFixed(2);

        // Store attendance details in subjectAttendance object
        if (!subjectAttendance[subjectId]) {
          subjectAttendance[subjectId] = {
            course: course.courseName,
            subject: subject.subName,
            presentDays: presentCount,
            totalClasses: totalClasses,
            attendancePercentage: attendancePercentage,
          };
        }

        // Calculate overall attendance for all subjects
        totalPresentDays += presentCount;
        totalDays += totalClasses;
      }
    }

    // Calculate overall attendance percentage across all subjects
    const overallAttendancePercentage = (
      (totalPresentDays / totalDays) *
      100
    ).toFixed(2);

    return res.status(200).json({
      success: true,
      msg: "Student attendance fetched successfully",
      subjectAttendance: Object.values(subjectAttendance), // Convert object values to array
      overallAttendancePercentage: overallAttendancePercentage,
    });
  } catch (err) {
    console.log("Something went wrong", err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// update student login info
// const updateStudentInfo = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { email, address, phone } = req.body;

//     let student = await Student.findById(studentId);

//     if (!student) {
//       return res.status(404).json({ success: false, msg: "Student not found" });
//     }

//     const result = await cloudinary.uploader.upload(req.file.path);

//     const { public_id, url } = result;

//     // Parse address string to object
//     const parsedAddress = JSON.parse(address);

//     // Validate parsedAddress to ensure it's an object with required fields
//     if (
//       typeof parsedAddress !== "object" ||
//       !parsedAddress.street ||
//       !parsedAddress.city ||
//       !parsedAddress.state ||
//       !parsedAddress.zip_code
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, msg: "Invalid address format" });
//     }

//     // Update fields
//     student.email = email;
//     student.address = {
//       street: parsedAddress.street,
//       city: parsedAddress.city,
//       state: parsedAddress.state,
//       zip_code: parsedAddress.zip_code,
//     };
//     student.phone = phone;
//     student.user_image = { public_id, url };

//     await student.save();

//     return res.status(200).json({
//       success: true,
//       msg: "Student updated successfully",
//       student,
//     });
//   } catch (err) {
//     console.log("Something went wrong", err);
//     return res
//       .status(500)
//       .json({ success: false, msg: "Internal server error" });
//   }
// };

const updateStudentInfo = async (req, res) => {
  try {
    let { studentId } = req.params;

    let student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student Not Found" });
    }

    const { email, address, phone } = req.body;

    const parsedAddress = JSON.parse(address);

    if (
      typeof parsedAddress !== "object" ||
      !parsedAddress.street ||
      !parsedAddress.city ||
      !parsedAddress.state ||
      !parsedAddress.zip_code
    ) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid address format" });
    }

    student.email = email;
    student.address = {
      street: parsedAddress.street,
      city: parsedAddress.city,
      state: parsedAddress.state,
      zip_code: parsedAddress.zip_code,
    };
    student.phone = phone;

    await student.save();

    res
      .status(200)
      .json({ success: true, msg: "Student Updated Successfully", student });
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

const updateStudentPhoto = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student Not Found" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const { public_id, url } = result;

    student.user_image = { public_id, url };

    await student.save();

    res
      .status(200)
      .json({ success: true, msg: "Image Updated Successfully", student });
  } catch (err) {
    console.log("Something went wrong", err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const genOtp = Math.floor(Math.random() * 10000);

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "85abc778c2ee17",
        pass: "5098589132ed3c",
      },
    });

    const info = await transporter.sendMail({
      from: "cgc@gmail.com",
      to: email, // list of receivers
      subject: "New OTP Generated", // Subject line
      html: `<b>OTP is : <i>${genOtp}</i></b>`, // html body
    });

    if (info.messageId) {
      let student = await Student.findOneAndUpdate(
        { email: email },
        { otp: genOtp },
        { new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ success: false, msg: "Student Not Found" });
      }
    }

    return res
      .status(200)
      .json({ success: true, msg: "OTP sent successfully" });
  } catch (err) {
    console.log("Something Went Wrong", err);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, password } = req.body;

    let student = await Student.findOne({ otp });

    if (!student) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    const securePass = await bcrypt.hash(password, 10);

    student = await Student.findOneAndUpdate(
      { otp },
      { password: securePass, otp: 0 },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, msg: "Password Updated Successfully" });
  } catch (err) {
    console.log("Something Went Wrong", err);
  }
};

// this is yet to be created
const getAllStudentAttendance = async (req, res) => {};

module.exports = {
  getStudents,
  getStudentDetails,
  addStudent,
  loginStudent,
  updatePass,
  deleteStudent,
  updateStudentInfo,
  updateStudentPhoto,
  getStudentAttendance,
  forgetPassword,
  verifyOtp,
};
