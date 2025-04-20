const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(201).json({ success: false, msg: "Unauthorized Acess" });
  }

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (Err) {
    return res.status(403).json({ success: false, msg: "Inavlid token" });
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, msg: "Unauthorized User" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        console.log("Token Verification Failed", err.message);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized User" });
      } else {
        if (decoded.role === "admin") {
          next();
        } else {
          console.log("User is Not Admin");
          return res.status(403).json({ success: false, message: "Forbidden" });
        }
      }
    }
  );
};

const isTeacher = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, msg: "Unauthorized User" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        console.log("Token Verification Failed", err.message);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized User" });
      } else {
        if (decoded.role === "teacher") {
          req.user = decoded;
          next();
        } else {
          console.log("User is Not Teacher");
          return res.status(403).json({ success: false, message: "Forbidden" });
        }
      }
    }
  );
};

module.exports = { verifyToken, isAdmin, isTeacher };
