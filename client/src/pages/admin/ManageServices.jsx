import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    requiredDocuments: '',
    processingTime: '',
    fees: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/services');
      setServices(response.data);
    } catch (error) {
      setError('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        requiredDocuments: service.requiredDocuments.join('\n'),
        processingTime: service.processingTime,
        fees: service.fees.toString(),
      });
    } else {
      setSelectedService(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        requiredDocuments: '',
        processingTime: '',
        fees: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      requiredDocuments: '',
      processingTime: '',
      fees: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        requiredDocuments: formData.requiredDocuments
          .split('\n')
          .filter((doc) => doc.trim()),
        fees: Number(formData.fees),
      };

      if (selectedService) {
        await axiosInstance.put(`/services/${selectedService._id}`, data);
      } else {
        await axiosInstance.post('/services', data);
      }

      fetchServices();
      handleCloseDialog();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Error saving service. Please try again.'
      );
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axiosInstance.delete(`/services/${serviceId}`);
        fetchServices();
      } catch (error) {
        setError('Error deleting service');
      }
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Manage Services
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Service
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Fees</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.title}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.processingTime}</TableCell>
                  <TableCell>₹{service.fees}</TableCell>
                  <TableCell>
                    <Chip
                      label={service.isActive ? 'Active' : 'Inactive'}
                      color={service.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(service._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedService ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Required Documents (one per line)"
                name="requiredDocuments"
                value={formData.requiredDocuments}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={4}
                helperText="Enter each required document on a new line"
              />
              <TextField
                fullWidth
                label="Processing Time"
                name="processingTime"
                value={formData.processingTime}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Fees"
                name="fees"
                type="number"
                value={formData.fees}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedService ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageServices; 