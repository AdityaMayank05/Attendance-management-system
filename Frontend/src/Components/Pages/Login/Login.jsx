import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Your CSS file for styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.data.success) {
        setMessage('Login successful!');
        const userRole = response.data.role;

        // Redirect based on user role
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'student') {
          navigate('/student');
        } else if (userRole === 'teacher') {
          navigate('/teacher');         }
      } else {
        setMessage('Error: ' + response.data.error);
      }
    } catch (error) {
      setMessage('Server error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            className="form-control"
            name="role"
            value={role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      {message && <div className="message">{message}</div>}
      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
