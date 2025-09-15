import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, Chip, Snackbar, Alert
} from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL;

export default function AudienceTable() {
  const [audience, setAudience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch customers (audience)
  const fetchAudience = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customers`);
      const data = await res.json();
      setAudience(data);
    } catch (err) {
      console.error("Failed to fetch audience:", err);
      setSnackbar({ open: true, message: 'Failed to load audience data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudience();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 8 }} />;

  return (
    <Box sx={{ width: '100%', py: 4, background: '#f6fafd', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1a73e8', textAlign: 'center', mb: 2 }}
        >
          Audience
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: '#5f6368', textAlign: 'center', mb: 4 }}
        >
          View all customers that form your CRM audience.
        </Typography>

        {/* Audience Table */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ background: '#f6fafd' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Spend</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Visits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {audience.map((cust) => (
                  <TableRow key={cust._id} hover>
                    <TableCell>{cust.name}</TableCell>
                    <TableCell>{cust.email}</TableCell>
                    <TableCell>{cust.phone}</TableCell>
                    <TableCell>
                      <Chip label={`₹${cust.totalSpend}`} color="primary" variant="outlined" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={cust.visits} color="secondary" variant="outlined" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
