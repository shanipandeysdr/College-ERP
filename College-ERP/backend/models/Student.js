const mongoose = require("mongoose");

const studSchema = new mongoose.Schema({
  student_id: {
    type: String,
    require: true,
  },
  user_image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://icons.iconarchive.com/icons/icons8/android/256/Users-User-icon.png",
    },
  },
  first_name: {
    type: String,
    require: true,
    trim: true, // Removes surrounding whitespace
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  dob: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zip_code: {
      type: String,
      default: "",
    },
  },
  phone: {
    type: String,
    require: true,
    trim: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  role: {
    type: String,
    require: true,
  },
  otp: {
    type: Number,
    default: 0,
  },
});

const Student = mongoose.model("Student", studSchema);
module.exports = Student;
