import { useState } from 'react';
import './App.css';
import LoginSignUp from './Components/Pages/LoginSignup/LoginSignUp';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Student from './Components/Pages/Student/Student';
import Home from './Components/Pages/Home/Home';
import Login from './Components/Pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminPage from './Components/Pages/Admin/AdminPage';
import Teacher from './Components/Pages/Teacher/Teacher';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Student" element={<Student />} />
        <Route path="/SignUp" element={<LoginSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
