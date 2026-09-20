const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { validateStudent } = require("../validators/student.validator");
const {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

const router = express.Router();

router.post("/", validateStudent, createStudent);
router.get("/", authMiddleware, getStudents);
router.put("/:id", authMiddleware, validateStudent, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

module.exports = router;
