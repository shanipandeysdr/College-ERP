const mongoose = require("mongoose");
const SubjectSchema = require("./Subject");

const Schema = new mongoose.Schema({
  courseName: {
    type: String,
    require: true,
  },
  subjects: [SubjectSchema],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Course = mongoose.model("Course", Schema);
module.exports = Course;
