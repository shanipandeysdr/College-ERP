const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const nodemailer = require("nodemailer");

const getTeacherDetails = async (req, res) => {
  try {
    const { teacherId } = req.params;

    let teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ success: false, msg: "Teacher Not Found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Teacher Details Fetched Successfully",
      teacher,
    });
  } catch (err) {
    console.log("Something Went Wrong", err);
  }
};

const addTeacher = async (req, res) => {
  try {
    const { teacher_Id, name, email, phno, password } = req.body;

    const existignTeacher = await Teacher.findOne({ teacher_Id });

    if (existignTeacher) {
      return res
        .status(400)
        .json({ success: false, msg: "Teacher Already Exist" });
    }

    const salt = 10;
    const hashPass = await bcrypt.hash(password, salt);

    const newTeacher = await Teacher.create({
      teacher_Id,
      name,
      email,
      password: hashPass,
      phno,
      role: "teacher",
    });

    res.status(201).json({
      success: true,
      msg: "Teacher Created Successfully",
      teacher: newTeacher,
    });
  } catch (Err) {
    console.log("Something went wrong", Err);
  }
};

// login teacher
const loginTeacher = async (req, res) => {
  try {
    const { teacher_Id, password } = req.body;

    let teacher = await Teacher.findOne({ teacher_Id });

    if (!teacher) {
      return res
        .status(400)
        .json({ success: false, msg: "User Does not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: teacher._id,
        user_id: teacher.teacher_Id,
        name: teacher.name,
        role: teacher.role,
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

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    const { currpass, newpass, confirmpass } = req.body;

    if (!(await bcrypt.compare(currpass, teacher.password))) {
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

    teacher.password = hashpass;

    await teacher.save();

    return res
      .status(200)
      .json({ success: true, msg: "Password Upadated Successfully" });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;

    let teacher = await Teacher.findOne({ teacher_Id: teacherId });

    if (!teacher) {
      res.status(404).json({ success: false, msg: "Teacher Not Found" });
    }

    const courses = await Course.find({ "subjects.teacher": teacher._id });

    courses.forEach((course) => {
      course.subjects.forEach((subject) => {
        // Remove the teacher from the teacher array
        subject.teacher = subject.teacher.filter(
          (teacherRef) => !teacherRef.equals(teacher._id)
        );
      });
    });

    // now we save the modified course by promise
    await Promise.all(courses.map((course) => course.save()));

    // delete teacher from the system
    await teacher.deleteOne();

    return res.status(200).json({
      success: true,
      msg: "Teacher Deleted and Removed from Subjects Successfully",
    });
  } catch (err) {
    console.log("Something went wrong:", err);
  }
};

// forget Password
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
      let teacher = await Teacher.findOneAndUpdate(
        { email: email },
        { otp: genOtp },
        { new: true }
      );

      if (!teacher) {
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

    let teacher = await Teacher.findOne({ otp });

    if (!teacher) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    const securePass = await bcrypt.hash(password, 10);

    teacher = await Teacher.findOneAndUpdate(
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

module.exports = {
  getTeacherDetails,
  addTeacher,
  loginTeacher,
  updatePassword,
  deleteTeacher,
  forgetPassword,
  verifyOtp,
};
