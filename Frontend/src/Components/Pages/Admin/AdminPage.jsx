import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Dropdown, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css'; // Add your CSS file for styling

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

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

    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teachers');
        setTeachers(response.data);
        setLoadingTeachers(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setLoadingTeachers(false);
      }
    };

    fetchStudents();
    fetchTeachers();
  }, []);

  const handleEditClick = (entity, type) => {
    if (type === 'teacher') {
      setEditingTeacher(entity);
    } else {
      setEditingStudent(entity);
    }
    setFormData({ name: entity.name, email: entity.email, password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = editingTeacher
      ? `http://localhost:5000/api/editteacher/${editingTeacher._id}`
      : `http://localhost:5000/api/editstudent/${editingStudent._id}`;
    try {
      const response = await axios.put(url, formData);
      const updatedEntity = response.data.data;
      if (editingTeacher) {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher._id === updatedEntity._id ? updatedEntity : teacher
          )
        );
        setEditingTeacher(null);
      } else {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === updatedEntity._id ? updatedEntity : student
          )
        );
        setEditingStudent(null);
      }
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

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
                    <div>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student._id}>
                              <td>{student._id}</td>
                              <td>{student.name}</td>
                              <td>{student.email}</td>
                              <td>
                                <button onClick={() => handleEditClick(student, 'student')}>Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      {editingStudent && (
                        <form onSubmit={handleFormSubmit}>
                          <h2>Edit Student</h2>
                          <div>
                            <label>
                              Name:
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                              />
                            </label>
                          </div>
                          <div>
                            <label>
                              Email:
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                              />
                            </label>
                          </div>
                          <div>
                            <label>
                              Password:
                              <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                              />
                            </label>
                          </div>
                          <button type="submit">Save</button>
                          <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}
              {selectedSection === 'teachers' && (
                <div>
                  <h2>Teacher Details</h2>
                  {loadingTeachers ? (
                    <p>Loading...</p>
                  ) : (
                    <div>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => (
                            <tr key={teacher._id}>
                              <td>{teacher._id}</td>
                              <td>{teacher.name}</td>
                              <td>{teacher.email}</td>
                              <td>
                                <button onClick={() => handleEditClick(teacher, 'teacher')}>Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      {editingTeacher && (
                        <form onSubmit={handleFormSubmit}>
                          <h2>Edit Teacher</h2>
                          <div>
                            <label>
                              Name:
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                              />
                            </label>
                          </div>
                          <div>
                            <label>
                              Email:
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                              />
                            </label>
                          </div>
                          <div>
                            <label>
                              Password:
                              <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                              />
                            </label>
                          </div>
                          <button type="submit">Save</button>
                          <button type="button" onClick={() => setEditingTeacher(null)}>Cancel</button>
                        </form>
                      )}
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

export default AdminPage;
