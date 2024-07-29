const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

// // Controller to get all employees
// exports.getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };  
 
     
  
// Controller to get paginated employees
exports.getEmployees = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const employees = await Employee.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const totalEmployees = await Employee.countDocuments();
    
    res.json({
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 
 


  
// Controller to create a new employee
exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : '';

    if (!image) {
      return res.status(400).json({ errors: [{ msg: 'Image is required', param: 'image' }] });
    }

    const newEmployee = new Employee({
      image,
      name,
      email,
      mobile,
      designation,
      gender,
      course,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


//update an employee
exports.updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, mobile, designation, gender, course, status } = req.body;
    const updateData = { name, email, mobile, designation, gender, course, status };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
 


// delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 