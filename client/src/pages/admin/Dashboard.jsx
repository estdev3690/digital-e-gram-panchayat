import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  People as PeopleIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: `${color}.light`,
      color: `${color}.dark`,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Icon sx={{ fontSize: 40, opacity: 0.7 }} />
      <Typography variant="h4">{value}</Typography>
    </Box>
    <Typography variant="subtitle1" sx={{ mt: 2 }}>
      {title}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Error fetching dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Applications"
              value={stats?.totalApplications || 0}
              icon={DescriptionIcon}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={PeopleIcon}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Services"
              value={stats?.activeServices || 0}
              icon={ListAltIcon}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Approved Applications"
              value={stats?.approvedApplications || 0}
              icon={CheckCircleIcon}
              color="warning"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Applications
              </Typography>
              {stats?.recentApplications?.length > 0 ? (
                <Box>
                  {stats.recentApplications.map((app) => (
                    <Box
                      key={app._id}
                      sx={{
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="subtitle1">
                        {app.applicationNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Service: {app.service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {app.status}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No recent applications
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Popular Services
              </Typography>
              {stats?.popularServices?.length > 0 ? (
                <Box>
                  {stats.popularServices.map((service) => (
                    <Box
                      key={service._id}
                      sx={{
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="subtitle1">{service.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applications: {service.applicationCount}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No services data</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 