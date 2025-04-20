const express = require("express");
const {
  addTeacher,
  loginTeacher,
  updatePassword,
  deleteTeacher,
  getTeacherDetails,
  forgetPassword,
  verifyOtp,
} = require("../controller/teacher");
const { isAdmin } = require("../middleware/Auth");

const router = express.Router();

// get teacher details
router.get("/:teacherId/details", getTeacherDetails);
// add Teacher --Admin
router.post("/addTeacher", isAdmin, addTeacher);
// login teacher
router.post("/login", loginTeacher);
//update Password
router.put("/updatePassword/:id", updatePassword);
// delete teacher --admin
router.delete("/deleteTeacher", isAdmin, deleteTeacher);
// forget password
router.post("/forgetPassword", forgetPassword);
// verify otp
router.post("/forgetPassword/verifyotp", verifyOtp);

module.exports = router;
