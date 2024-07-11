import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Dropdown, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Teacher.css'; // Add your CSS file for styling

const Teacher = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('personalInfo');
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students');
        setStudents(response.data);
        setLoadingStudents(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const checkAttendanceMarked = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/check?date=${selectedDate.toISOString().split('T')[0]}`);
        setAttendanceMarked(response.data.marked);
      } catch (error) {
        console.error('Error checking attendance:', error);
      }
    };

    checkAttendanceMarked();
  }, [selectedDate]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceEntries = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        date: selectedDate,
        status
      }));

      for (const entry of attendanceEntries) {
        await axios.post('http://localhost:5000/api/attendance/mark', entry);
      }

      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error('Error marking attendance');
      console.error('Error marking attendance:', error);
    }
  };

  const userName = "Teacher Name"; // Replace with actual logged-in user name if available

  return (
    <div className="teacher-page">
      <ToastContainer />
      <Container fluid>
        <Row className="no-gutters">
          <Col md={2} className="sidebar">
            <Nav defaultActiveKey="/teacher/personalInfo" className="flex-column">
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
              <h1>Welcome to the Teacher Dashboard</h1>
              {selectedSection === 'personalInfo' && (
                <div>
                  <h2>Personal Info</h2>
                  <p>Personal information content goes here...</p>
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
                  {attendanceMarked ? (
                    <p>Attendance already marked for the selected date.</p>
                  ) : (
                    loadingStudents ? (
                      <p>Loading...</p>
                    ) : (
                      <Form>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.length > 0 ? (
                              students.map((student, index) => (
                                <tr key={student._id}>
                                  <td>{index + 1}</td>
                                  <td>{student.name}</td>
                                  <td>{student.email}</td>
                                  <td>
                                    <Dropdown onSelect={(status) => handleAttendanceChange(student._id, status)}>
                                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        {attendance[student._id] || 'Select Status'}
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item eventKey="P">Present</Dropdown.Item>
                                        <Dropdown.Item eventKey="A">Absent</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4">No students found</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                        <Button variant="primary" onClick={handleSubmitAttendance}>Submit Attendance</Button>
                      </Form>
                    )
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

export default Teacher;
