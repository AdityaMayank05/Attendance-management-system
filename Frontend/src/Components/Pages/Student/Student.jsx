import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Student.css'; // Add your CSS file for styling

const Student = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [studentInfo, setStudentInfo] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const emailId = localStorage.getItem('userEmail'); // Store email in local storage

  useEffect(() => {
    // Fetch attendance for the selected date using stored email ID
    const fetchAttendance = async () => {
      setLoadingAttendance(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/${emailId}`);
        console.log('Attendance API response:', response.data);
        setAttendance(response.data); // Assuming response.data is an array of attendance records
        if (response.data.length > 0) {
          setStudentInfo(response.data[0].studentInfo); // Assuming studentInfo is the same for all attendance records
        }
        setLoadingAttendance(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, [emailId]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Clear email from local storage on logout
    navigate('/');
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const userName = studentInfo.name || "Student Name"; // Use student's name if available, otherwise default

  // Calculate total number of present and absent records
  const totalPresent = attendance.filter(record => record.status === 'P').length;
  const totalAbsent = attendance.filter(record => record.status === 'A').length;

  // Calculate attendance percentage
  const totalRecords = attendance.length;
  const attendancePercentage = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(2) : 0;

  return (
    <div className="student-page">
      <ToastContainer />
      <Container fluid>
        <Row className="no-gutters">
          <Col md={2} className="sidebar">
            <Nav defaultActiveKey="/student/dashboard" className="flex-column">
              <Nav.Link href="#dashboard" onClick={() => handleSectionSelect('dashboard')}>Dashboard</Nav.Link>
              <Nav.Link href="#personalInfo" onClick={() => handleSectionSelect('personalInfo')}>Personal Info</Nav.Link>
              <Nav.Link href="#attendance" onClick={() => handleSectionSelect('attendance')}>Attendance</Nav.Link>
              <Nav.Item className="mt-auto">
                <Button onClick={handleLogout}>Logout</Button>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={10} className="content">
            <div className="top-right-section">
              <Dropdown>
                <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                  {userName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Container fluid className="content-container">
              <h1>Welcome to the Student Dashboard</h1>
              {selectedSection === 'dashboard' && (
                <div>
                  <h2>Dashboard</h2>
                  <p>Welcome to your dashboard. Here you can see an overview of your activities and progress.</p>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Total Present</th>
                        <th>Total Absent</th>
                        <th>Attendance Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{totalPresent}</td>
                        <td>{totalAbsent}</td>
                        <td>{attendancePercentage}%</td>
                      </tr>
                    </tbody>
                  </table>
                  {/* Add more dashboard content as needed */}
                </div>
              )}
              {selectedSection === 'personalInfo' && (
                <div>
                  <h2>Personal Info</h2>
                  <p>Name: {studentInfo.name}</p>
                  <p>Email: {studentInfo.email}</p>
                  {/* Add more personal information as needed */}
                </div>
              )}
              {selectedSection === 'attendance' && (
                <div>
                  <h2>Attendance</h2>
                  <div className="date-picker-container">
                    <label>Select Date: </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  {loadingAttendance ? (
                    <p>Loading...</p>
                  ) : (
                    <div>
                      <h3>Attendance for {selectedDate.toISOString().split('T')[0]}</h3>
                      <ul>
                        {attendance
                          .filter(record => new Date(record.date).toDateString() === selectedDate.toDateString())
                          .map((record, index) => (
                            <li key={index}>{record.status === 'P' ? 'Present' : 'Absent'}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Student;
