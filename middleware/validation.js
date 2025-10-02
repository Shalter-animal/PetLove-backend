const { body, validationResult } = require('express-validator');


exports.registerValidation = [
  // ПЕРЕВІРКА ІМ'Я
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  // ПЕРЕВІРКА EMAIL
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),


  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {

      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];


exports.loginValidation = [

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];


exports.validate = (req, res, next) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  
  errors.array().map(err => {
    extractedErrors.push({ 
      field: err.path,
      message: err.msg
    });
  });

  return res.status(400).json({
    success: false,
    errors: extractedErrors
  });
};

