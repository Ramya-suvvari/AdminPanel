import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee, updateEmployee } from '../services/api';
import '../styles/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [], // Ensure course is an array
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await getEmployees({ page: currentPage });
        const employeesData = result.data.employees.map(employee => ({
          ...employee,
          course: Array.isArray(employee.course) ? employee.course : [] // Ensure course is an array
        }));
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        setTotalPages(result.data.totalPages);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.mobile.includes(searchQuery)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const handleEditClick = (employee) => {
    setEditingEmployee(employee._id);
    setFormData(employee);
  };

  const handleDeleteClick = async (id) => {
    await deleteEmployee(id);
    setEmployees(employees.filter(employee => employee._id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleGenderChange = (e) => {
    setFormData({
      ...formData,
      gender: e.target.value
    });
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      const courses = prevFormData.course;
      if (checked) {
        return { ...prevFormData, course: [...courses, value] };
      } else {
        return { ...prevFormData, course: courses.filter((course) => course !== value) };
      }
    });
  };

  const handleStatusChange = async (id, status) => {
    const updatedEmployee = employees.find(employee => employee._id === id);
    updatedEmployee.status = status;
    try {
      const res = await updateEmployee(id, updatedEmployee);
      setEmployees(employees.map(emp => (emp._id === id ? res.data : emp)));
    } catch (err) {
      console.error('Error updating employee status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    if (formData.image) updatedData.append('image', formData.image);
    updatedData.append('name', formData.name);
    updatedData.append('email', formData.email);
    updatedData.append('mobile', formData.mobile);
    updatedData.append('designation', formData.designation);
    updatedData.append('gender', formData.gender);
    updatedData.append('course', JSON.stringify(formData.course));
    updatedData.append('status', formData.status);

    try {
      const res = await updateEmployee(editingEmployee, updatedData);
      setEmployees(employees.map(emp => (emp._id === editingEmployee ? res.data : emp)));
      setEditingEmployee(null);
      setFormData({
        image: null,
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        status: 'active'
      });
      setErrors({});
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorObj = {};
        err.response.data.errors.forEach(error => {
          errorObj[error.param] = error.msg;
        });
        setErrors(errorObj);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <div className="employee-count">Total Employees: {employees.length}</div>
      <input 
        type="text" 
        placeholder="Search employees..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Created Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{(currentPage - 1) * 3 + index + 1}</td>
              <td><img src={`http://localhost:5000/${employee.image}`} alt={employee.name} width="50" height="50" /></td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{Array.isArray(employee.course) ? employee.course.join(', ') : ''}</td>
              <td>{new Date(employee.createDate).toLocaleDateString()}</td>
              <td>
                <select value={employee.status} onChange={(e) => handleStatusChange(employee._id, e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleEditClick(employee)}>Edit</button>
                <button onClick={() => handleDeleteClick(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {editingEmployee && (
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
                value={formData.name} 
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
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <span>{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Mobile:</label>
              <input 
                type="text" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange} 
              />
              {errors.mobile && <span>{errors.mobile}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Designation:</label>
              <select name="designation" value={formData.designation} onChange={handleChange}>
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
                    checked={formData.gender === 'Male'} 
                    onChange={handleGenderChange} 
                  />
                  Male
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Female" 
                    checked={formData.gender === 'Female'} 
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
                    checked={formData.course.includes('MCA')} 
                    onChange={handleCourseChange} 
                  />
                  MCA
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="course" 
                    value="BCA" 
                    checked={formData.course.includes('BCA')} 
                    onChange={handleCourseChange} 
                  />
                  BCA
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="course" 
                    value="BSC" 
                    checked={formData.course.includes('BSC')} 
                    onChange={handleCourseChange} 
                  />
                  BSC
                </label>
              </div>
              {errors.course && <span>{errors.course}</span>}
            </div>
          </div>
          <button type="submit">Update Employee</button>
        </form>
      )}
    </div>
  );
};

export default EmployeeList;
