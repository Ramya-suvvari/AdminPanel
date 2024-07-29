const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const upload = require('../middleware/upload');
const { getEmployees, createEmployee,updateEmployee, deleteEmployee} = require('../controllers/employeeController');

router.get('/', getEmployees); 

// Custom validator for email
const customEmailValidator = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!emailRegex.test(value)) {
    throw new Error('Email must be a valid company email');
  }
  return true;
};
   
// Custom validator for mobile
const customMobileValidator = (value) => {
  const mobileRegex = /^[0-9]{10}$/; // Adjust the regex according to your format
  if (!mobileRegex.test(value)) {
    throw new Error('Mobile must be a valid 10-digit number');
  }
  return true;
}; 
 
router.post('/', upload, [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').custom(customEmailValidator),
  check('mobile').custom(customMobileValidator),   
  check('designation').notEmpty().withMessage('Designation is required'),
  check('gender').notEmpty().withMessage('Gender is required'),
  check('course').notEmpty().withMessage('Course is required')
], createEmployee);
     


router.put('/:id', upload, [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').custom(customEmailValidator),
  check('mobile').custom(customMobileValidator), 
  check('designation').notEmpty().withMessage('Designation is required'),
  check('gender').notEmpty().withMessage('Gender is required'),
  check('course').notEmpty().withMessage('Course is required'),
  check('status').isIn(['active', 'inactive']).withMessage('Status is required and should be either active or inactive')
], updateEmployee); 



router.delete('/:id', deleteEmployee);

module.exports = router;
  
  
