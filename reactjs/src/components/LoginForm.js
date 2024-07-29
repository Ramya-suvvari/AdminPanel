import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Login.css';
 

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await login(formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.user.name);  
        navigate('/dashboard');
      }  
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Extract error message from the response
        const errorMsg = err.response.data.errors[0].msg;
        setErrors({ general: errorMsg });
      } else {
        setErrors({ general: 'Error logging in' });
      }
    }
  };

  const getError = (param) => {
    return errors[param] ? <span style={{ color: 'red' }}>{errors[param]}</span> : null;
  };

  const handleCreatAccount = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-box" >
      <h2>Login</h2>
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {getError('email')}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {getError('password')}
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
        <a className="create-account-button" onClick={handleCreatAccount}>
          <span>GoTo </span><span>Login</span> 
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
   