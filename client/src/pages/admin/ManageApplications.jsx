import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Link,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const statusColors = {
  pending: 'warning',
  'under-review': 'info',
  approved: 'success',
  rejected: 'error',
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get('/api/applications');
      setApplications(response.data);
    } catch (error) {
      setError('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsDialog(true);
  };

  const handleUpdateClick = () => {
    setDetailsDialog(false);
    setNewStatus(selectedApplication.status);
    setComment('');
    setUpdateDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!comment.trim()) {
      return;
    }

    setUpdating(true);
    try {
      await axiosInstance.patch(
        `/api/applications/${selectedApplication._id}/status`,
        {
          status: newStatus,
          comment: comment.trim(),
        }
      );

      // Update the local state
      setApplications(applications.map(app =>
        app._id === selectedApplication._id
          ? { ...app, status: newStatus }
          : app
      ));

      setUpdateDialog(false);
      setSelectedApplication(null);
      setNewStatus('');
      setComment('');
    } catch (error) {
      setError('Error updating application status');
    } finally {
      setUpdating(false);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Applications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application Number</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>{application.applicationNumber}</TableCell>
                  <TableCell>{application.service.title}</TableCell>
                  <TableCell>
                    {application.applicant.name}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {application.applicant.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(application.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={application.status}
                      color={statusColors[application.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(application)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {applications.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography color="text.secondary">
              No applications found.
            </Typography>
          </Box>
        )}

        {/* Application Details Dialog */}
        <Dialog
          open={detailsDialog}
          onClose={() => setDetailsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedApplication && (
            <>
              <DialogTitle>
                Application Details - {selectedApplication.applicationNumber}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ pt: 2 }}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Service Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Service"
                          secondary={selectedApplication.service.title}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Processing Time"
                          secondary={selectedApplication.service.processingTime}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Fees"
                          secondary={`₹${selectedApplication.service.fees}`}
                        />
                      </ListItem>
                    </List>
                  </Paper>

                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Applicant Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Name"
                          secondary={selectedApplication.applicant.name}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Email"
                          secondary={selectedApplication.applicant.email}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Phone"
                          secondary={selectedApplication.applicant.phone || 'Not provided'}
                        />
                      </ListItem>
                    </List>
                  </Paper>

                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Uploaded Documents
                    </Typography>
                    <List>
                      {selectedApplication.documents.map((doc, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={doc.name}
                              secondary={formatDate(doc.uploadedAt)}
                            />
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DescriptionIcon />}
                              component={Link}
                              href={`http://localhost:5000/${doc.path}`}
                              target="_blank"
                              sx={{ ml: 2 }}
                            >
                              View
                            </Button>
                          </ListItem>
                          {index < selectedApplication.documents.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>

                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Application Timeline
                    </Typography>
                    <List>
                      {selectedApplication.remarks.map((remark, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    label={remark.status}
                                    color={statusColors[remark.status]}
                                    size="small"
                                  />
                                  <Typography variant="caption">
                                    {formatDate(remark.updatedAt)}
                                  </Typography>
                                </Box>
                              }
                              secondary={remark.comment}
                            />
                          </ListItem>
                          {index < selectedApplication.remarks.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialog(false)}>Close</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateClick}
                >
                  Update Status
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)}>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ mb: 2 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                error={!comment.trim()}
                helperText={!comment.trim() ? 'Comment is required' : ''}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
            <Button
              onClick={handleUpdateStatus}
              variant="contained"
              disabled={updating || !comment.trim()}
            >
              {updating ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageApplications; 