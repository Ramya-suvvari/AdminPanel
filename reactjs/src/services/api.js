import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
 
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const createEmployee = (employeeData) => API.post('/employees', employeeData);
export const updateEmployee = (id, employeeData) => API.put(`/employees/${id}`, employeeData);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

export const getEmployees = ({ page = 1, limit = 3 }) => 
  API.get('/employees', { params: { page, limit } });

export const getUserDetails = (token) => {
  return API.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
 


