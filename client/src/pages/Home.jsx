import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: 'Browse Services',
      description: 'Explore available gram panchayat services and schemes',
      icon: <SearchIcon fontSize="large" color="primary" />,
      path: '/services',
    },
    {
      title: 'My Applications',
      description: 'Track and manage your service applications',
      icon: <DescriptionIcon fontSize="large" color="primary" />,
      path: '/applications',
    },
    {
      title: 'Profile',
      description: 'View and update your profile information',
      icon: <PersonIcon fontSize="large" color="primary" />,
      path: '/profile',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Access and manage gram panchayat services easily through our digital platform.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {quickLinks.map((link) => (
          <Grid item xs={12} sm={6} md={4} key={link.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {link.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {link.title}
                </Typography>
                <Typography align="center" color="text.secondary">
                  {link.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(link.path)}
                >
                  Go to {link.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user.role === 'admin' && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Administrative Tools
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Admin Dashboard
                  </Typography>
                  <Typography color="text.secondary">
                    Access administrative controls and analytics
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/admin')}
                  >
                    Go to Dashboard
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Home; 