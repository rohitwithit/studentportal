const mongoose = require("mongoose");
const studentService = require("../services/student.service");

async function createStudent(req, res, next) {
  try {
    const student = await studentService.createStudent(req.body);
    res
      .status(201)
      .json({ success: true, message: "Student added successfully", student });
  } catch (error) {
    next(error);
  }
}

async function getStudents(req, res, next) {
  try {
    const students = await studentService.getStudents();
    res.json({ success: true, students });
  } catch (error) {
    next(error);
  }
}

async function updateStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }
    await studentService.deleteStudent(req.params.id);
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = { createStudent, getStudents, updateStudent, deleteStudent };
