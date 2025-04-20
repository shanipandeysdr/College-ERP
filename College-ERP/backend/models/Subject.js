const mongoose = require("mongoose");
const AttendanceSchema = require("./Attendance");

const SubjectSchema = new mongoose.Schema({
  subName: {
    type: String,
    require: true,
  },
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  attendance: [AttendanceSchema],
});

module.exports = SubjectSchema;
