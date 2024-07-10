import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Dropdown, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css'; // Add your CSS file for styling

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);  // Update state here
        setLoadingStudents(false);
      } catch (error) {
        console.error('Error fetching students:', error.message);
        setLoadingStudents(false);
      }
    };
  
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();
        setTeachers(data);  // Update state here
        setLoadingTeachers(false);
      } catch (error) {
        console.error('Error fetching teachers:', error.message);
        setLoadingTeachers(false);
      }
    };
  
    fetchStudents();
    fetchTeachers();
  }, []);
  

  const handleLogout = () => {
    navigate('/');
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const userName = "Admin Name"; // Replace with actual logged-in user name if available

  return (
    <div className="admin-page">
      <Container fluid>
        <Row className="no-gutters">
          <Col md={2} className="sidebar">
            <Nav defaultActiveKey="/admin/dashboard" className="flex-column">
              <Nav.Link href="#dashboard" onClick={() => handleSectionSelect('dashboard')}>Dashboard</Nav.Link>
              <Nav.Link href="#students" onClick={() => handleSectionSelect('students')}>Students</Nav.Link>
              <Nav.Link href="#teachers" onClick={() => handleSectionSelect('teachers')}>Teachers</Nav.Link>
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
                  {/* Add more dropdown items as needed */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Container fluid className="content-container">
              <h1>Welcome to the Admin Dashboard</h1>
              {selectedSection === 'dashboard' && (
                <div>
                  <p>Dashboard content goes here...</p>
                </div>
              )}
              {selectedSection === 'students' && (
                <div>
                  <h2>Student Details</h2>
                  {loadingStudents ? (
                    <p>Loading...</p>
                  ) : (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length > 0 ? (
                          students.map((student, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{student.name}</td>
                              <td>{student.email}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No students found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}

              {selectedSection === 'teachers' && (
                <div>
                  <h2>Teacher Details</h2>
                  {loadingTeachers ? (
                    <p>Loading...</p>
                  ) : (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.length > 0 ? (
                          teachers.map((teacher, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{teacher.name}</td>
                              <td>{teacher.email}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No teachers found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
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

export default AdminPage;
