import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const NewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState({});

  const service = location.state?.service;

  if (!service) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          No service selected. Please select a service first.
        </Alert>
      </Container>
    );
  }

  const handleFileChange = (documentName) => (event) => {
    if (event.target.files[0]) {
      setFiles({
        ...files,
        [documentName]: event.target.files[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('service', service._id);
      
      // Append each document to the formData
      Object.entries(files).forEach(([name, file]) => {
        formData.append('documents', file);
      });

      const response = await axiosInstance.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Increase timeout for this specific request
        timeout: 60000, // 60 seconds
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        },
      });

      navigate(`/applications/${response.data.application._id}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED' 
          ? 'Upload timeout. Please try again with smaller files or check your connection.'
          : 'Error submitting application. Please try again later.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          New Application
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {service.title}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Required Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please upload all the required documents in PDF, JPG, or PNG format.
            Maximum file size: 5MB.
          </Typography>

          <form onSubmit={handleSubmit}>
            <List>
              {service.requiredDocuments.map((doc, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc}
                      secondary={files[doc]?.name || 'No file selected'}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      sx={{ ml: 2 }}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange(doc)}
                      />
                    </Button>
                  </ListItem>
                  {index < service.requiredDocuments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  loading ||
                  service.requiredDocuments.some((doc) => !files[doc])
                }
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Application'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewApplication; 