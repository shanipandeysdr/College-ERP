const express = require("express");
const {
  getStudents,
  addStudent,
  loginStudent,
  updatePass,
  deleteStudent,
  getStudentAttendance,
  updateStudentInfo,
  getStudentDetails,
  updateStudentPhoto,
  forgetPassword,
  verifyOtp,
} = require("../controller/student");
const { verifyToken, isAdmin } = require("../middleware/Auth");
const upload = require("../middleware/multer");
const router = express.Router();

// get all students
router.get("/", getStudents);
// get Student Details
router.get("/:studentId/details", getStudentDetails);
// add student --admin
router.post("/register", isAdmin, addStudent);
// login student
router.post("/login", loginStudent);
// update password
router.put("/updatePass/:id", updatePass);
// delete students --admin
router.delete("/deleteStudent", isAdmin, deleteStudent);
// update student info
router.put("/:studentId/updateInfo", upload.single("image"), updateStudentInfo);
// update student photo
router.put(
  "/:studentId/updatePhoto",
  upload.single("image"),
  updateStudentPhoto
);
// get student attendance
router.get("/getAttendance/:id", getStudentAttendance);
// forget password
router.post("/forgetPassword", forgetPassword);
// verify password
router.post("/forgetPassword/verifyotp", verifyOtp);

module.exports = router;
