import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Services from './pages/services/Services';
import ServiceDetails from './pages/services/ServiceDetails';
import Applications from './pages/applications/Applications';
import ApplicationDetails from './pages/applications/ApplicationDetails';
import NewApplication from './pages/applications/NewApplication';
import Profile from './pages/profile/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import ManageServices from './pages/admin/ManageServices';
import ManageUsers from './pages/admin/ManageUsers';
import ManageApplications from './pages/admin/ManageApplications';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Root redirect component
const RootRedirect = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Navigate to="/admin" /> : <Home />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<RootRedirect />} />
        
        {/* User Routes */}
        <Route
          path="/services"
          element={
            <PrivateRoute roles={['user']}>
              <Services />
            </PrivateRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <PrivateRoute roles={['user']}>
              <ServiceDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <PrivateRoute roles={['user']}>
              <Applications />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications/new"
          element={
            <PrivateRoute roles={['user']}>
              <NewApplication />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <PrivateRoute roles={['user']}>
              <ApplicationDetails />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <PrivateRoute roles={['admin']}>
              <ManageServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={['admin']}>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <PrivateRoute roles={['admin']}>
              <ManageApplications />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App; 