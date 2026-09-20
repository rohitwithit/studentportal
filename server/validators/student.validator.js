const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  dob: Joi.date().iso().required(),
  class: Joi.string().trim().required(),
  course: Joi.string().trim().required(),
  fees: Joi.number().min(0).required(),
  phone: Joi.string().trim().allow(""),
  address: Joi.string().trim().allow(""),
  isActive: Joi.boolean(),
});

function validateStudent(req, res, next) {
  const { error, value } = studentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
}

module.exports = { validateStudent };
