import React, { useState } from 'react';
import { createEmployee } from '../services/api';
import '../styles/CreateEmployee.css';

const CreateEmployee = () => {
  const [employee, setEmployee] = useState({
    image: null,
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setEmployee({
      ...employee,
      image: e.target.files[0]
    });
  };

  const handleGenderChange = (e) => {
    setEmployee({
      ...employee,
      gender: e.target.value
    });
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setEmployee((prevEmployee) => {
      const courses = checked
        ? [...prevEmployee.courses, value]
        : prevEmployee.courses.filter((course) => course !== value);
      return {
        ...prevEmployee,
        courses
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', employee.image);
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobile', employee.mobile);
    formData.append('designation', employee.designation);
    formData.append('gender', employee.gender);
    employee.courses.forEach((course) => formData.append('course', course));

    try {
      const res = await createEmployee(formData);
      console.log(res.data);
      setErrors({}); // Clear errors if successful
      alert('Employee created successfully!');
      // Optionally, reset the form or redirect the user
      setEmployee({
        image: null,
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: []
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorObj = {};
        err.response.data.errors.forEach(error => {
          if (error.path) {
            errorObj[error.path] = error.msg;
          } else if (error.param) {
            errorObj[error.param] = error.msg;
          }
        });
        setErrors(errorObj);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-employee-form">
      <div className="form-row">
        <div className="form-group">
          <label>Image:</label>
          <input type="file" name="image" onChange={handleImageChange} />
          {errors.image && <span>{errors.image}</span>}
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={employee.name} 
            onChange={handleChange} 
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={employee.email} 
            onChange={handleChange} 
          />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Mobile:</label>
          <input 
            type="text" 
            name="mobile" 
            value={employee.mobile} 
            onChange={handleChange} 
          />
          {errors.mobile && <span>{errors.mobile}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Designation:</label>
          <select name="designation" value={employee.designation} onChange={handleChange}>
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && <span>{errors.designation}</span>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <div>
            <label>
              <input 
                type="radio" 
                name="gender" 
                value="Male" 
                checked={employee.gender === 'Male'} 
                onChange={handleGenderChange} 
              />
              Male
            </label>
            <label>
              <input 
                type="radio" 
                name="gender" 
                value="Female" 
                checked={employee.gender === 'Female'} 
                onChange={handleGenderChange} 
              />
              Female
            </label>
          </div>
          {errors.gender && <span>{errors.gender}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Courses:</label>
          <div>
            <label>
              <input 
                type="checkbox" 
                name="course" 
                value="MCA" 
                checked={employee.courses.includes('MCA')} 
                onChange={handleCourseChange} 
              />
              MCA
            </label>
            <label>
              <input 
                type="checkbox" 
                name="course" 
                value="BCA" 
                checked={employee.courses.includes('BCA')} 
                onChange={handleCourseChange} 
              />
              BCA
            </label>
            <label>
              <input 
                type="checkbox" 
                name="course" 
                value="BSC" 
                checked={employee.courses.includes('BSC')} 
                onChange={handleCourseChange} 
              />
              BSC
            </label>
          </div>
          {errors.course && <span>{errors.course}</span>}
        </div>
      </div>
      <button type="submit">Create Employee</button>
    </form>
  );
};

export default CreateEmployee;
  