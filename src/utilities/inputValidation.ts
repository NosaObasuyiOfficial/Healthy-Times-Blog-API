import Joi from 'joi'

export const user_signup = Joi.object({
    userName: Joi.string().required()
    .messages({
        'any.required': 'user_name is required'
    }),
    email: Joi.string().email().required()
    .messages({
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(7)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.min': 'Password must be at least 7 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      'any.required': 'Password is required',
    })
})

export const user_login = Joi.object({
    email: Joi.string().email().required()
    .messages({
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(7)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.min': 'Password must be at least 7 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      'any.required': 'Password is required',
    })
})

export const user_updates = Joi.object({
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zip: Joi.string().allow(''),
    country: Joi.string().allow('')
})










