const { body, validationResult} = require('express-validator');

const userValidatorRules = () => {
  return [
    body('name').notEmpty().withMessage('Username required!'),
    body('email').notEmpty().withMessage('Email required!'),
    body('email').isEmail().withMessage('Email is not found!'),
    body('password').notEmpty().withMessage('Password required!'),
    body('password').isLength({min: 6}).withMessage('Password should at least contain 6 characters.'),
  ]
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if(errors.isEmpty()){
    return next();
  };
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({
    [err.path]: err.msg,
  }));
  return res.status(400).json({errors: extractedErrors});
};

module.exports = {
  userValidatorRules,
  validate,
};