import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await axiosInstance.get(`/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError(
        error.response?.data?.message ||
        'Error fetching service details. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    navigate(`/applications/new`, { state: { service } });
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

  if (error || !service) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Service not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {service.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {service.description}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Service Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Processing Time"
                      secondary={service.processingTime}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoneyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Application Fee"
                      secondary={`₹${service.fees}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Category" secondary={service.category} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Paper sx={{ mt: 4, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Required Documents
              </Typography>
              <List>
                {service.requiredDocuments.map((doc, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary={doc} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                position: 'sticky',
                top: '2rem',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Apply for Service
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please ensure you have all the required documents ready before
                  applying.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ServiceDetails; 