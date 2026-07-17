const { error } = require('../utils/apiResponse');

/**
 * Validate request body against a Joi schema
 */
const validate = (schema) => (req, res, next) => {
  const { error: validationError, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationError) {
    const errors = validationError.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return error(res, 'Validation failed', 422, errors);
  }

  req.body = value;
  next();
};

module.exports = validate;
