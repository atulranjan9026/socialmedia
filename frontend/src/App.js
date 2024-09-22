import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import UserForm from './components/UserForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'; // Import React Bootstrap components

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navigation Bar */}
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">User Submission</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Submit</Nav.Link>
                <Nav.Link as={Link} to="/admin/login">Admin</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
