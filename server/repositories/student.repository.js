const Student = require("../models/student.model");

const studentRepository = {
  create(data) {
    return Student.create(data);
  },

  findAll() {
    return Student.find().sort({ createdAt: -1 });
  },

  findById(id) {
    return Student.findById(id);
  },

  updateById(id, data) {
    return Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  deleteById(id) {
    return Student.findByIdAndDelete(id);
  },
};

module.exports = studentRepository;
