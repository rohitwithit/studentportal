const studentRepository = require("../repositories/student.repository");

const studentService = {
  createStudent(data) {
    return studentRepository.create(data);
  },

  getStudents() {
    return studentRepository.findAll();
  },

  async updateStudent(id, data) {
    const student = await studentRepository.updateById(id, data);
    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }
    return student;
  },

  async deleteStudent(id) {
    const student = await studentRepository.deleteById(id);
    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }
    return student;
  },
};

module.exports = studentService;
