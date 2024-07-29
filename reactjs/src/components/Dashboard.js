import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import CreateEmployee from './CreateEmployee';
import Home from './Home';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  if (!username) {
    navigate('/login');
    return null;
  }

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <>
      <div className="navbar">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="employees">Employee List</Link></li>
          <li><Link to="create-employee">Create Employee</Link></li>
        </ul>
        <ul className="right">
          <li><Link to="#">Welcome, {username}</Link></li>
          <li>
            <button onClick={logoutUser} >Logout</button>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="create-employee" element={<CreateEmployee />} />
      </Routes>
    </>
  );
};
 
export default Dashboard;
 