const Joi = require('joi');
const { ROLES } = require('../config/roles');

const createEmployeeSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'any.required': 'Name is required',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-()]{7,20}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  department: Joi.string().hex().length(24).required().messages({
    'any.required': 'Department is required',
  }),
  designation: Joi.string().max(100).required().messages({
    'any.required': 'Designation is required',
  }),
  salary: Joi.number().min(0).optional().messages({
    'number.min': 'Salary cannot be negative',
  }),
  joiningDate: Joi.date().required().messages({
    'any.required': 'Joining date is required',
  }),
  status: Joi.string().valid('active', 'inactive').default('active'),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .default(ROLES.EMPLOYEE),
  reportingManager: Joi.string().hex().length(24).optional().allow(null, ''),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-()]{7,20}$/)
    .optional()
    .allow('', null),
  department: Joi.string().hex().length(24).optional(),
  designation: Joi.string().max(100).optional(),
  salary: Joi.number().min(0).optional(),
  joiningDate: Joi.date().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .optional(),
  reportingManager: Joi.string().hex().length(24).optional().allow(null, ''),
}).min(1);

const updateManagerSchema = Joi.object({
  managerId: Joi.string().hex().length(24).required().allow(null).messages({
    'any.required': 'Manager ID is required',
  }),
});

module.exports = { createEmployeeSchema, updateEmployeeSchema, updateManagerSchema };
