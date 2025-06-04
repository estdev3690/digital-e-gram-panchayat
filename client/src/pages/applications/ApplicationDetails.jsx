import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from '@mui/material';
import axiosInstance from '../../config/axios';

const statusColors = {
  pending: 'warning',
  'under-review': 'info',
  approved: 'success',
  rejected: 'error',
};

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await axiosInstance.get(`/api/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      setError('Error fetching application details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (error || !application) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Application not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h4" component="h1">
                Application Details
              </Typography>
              <Chip
                label={application.status}
                color={statusColors[application.status]}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Application Number"
                    secondary={application.applicationNumber}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Service"
                    secondary={application.service.title}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Submitted On"
                    secondary={formatDate(application.createdAt)}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={formatDate(application.updatedAt)}
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Application Timeline
              </Typography>
              <List>
                {application.remarks.map((remark, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="subtitle1">
                              Status changed to{' '}
                              <Chip
                                label={remark.status}
                                color={statusColors[remark.status]}
                                size="small"
                              />
                            </Typography>
                            <Typography variant="caption">
                              {formatDate(remark.updatedAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={remark.comment}
                      />
                    </ListItem>
                    {index < application.remarks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Documents
                </Typography>
                {application.documents.length > 0 ? (
                  <List>
                    {application.documents.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={doc.name}
                          secondary={formatDate(doc.uploadedAt)}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    No documents uploaded
                  </Typography>
                )}
              </CardContent>
            </Card>

            {application.paymentDetails && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Amount"
                        secondary={`₹${application.paymentDetails.amount}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Transaction ID"
                        secondary={application.paymentDetails.transactionId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Paid On"
                        secondary={
                          application.paymentDetails.paidAt
                            ? formatDate(application.paymentDetails.paidAt)
                            : 'Not paid'
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ApplicationDetails; 