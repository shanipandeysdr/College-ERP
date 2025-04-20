const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  teacher_Id: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phno: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "Teacher",
  },
  otp: {
    type: Number,
    default: 0,
  },
});

const Teacher = mongoose.model("Teacher", schema);
module.exports = Teacher;
