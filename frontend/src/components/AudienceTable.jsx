import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, Chip, Snackbar, Alert,
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL;

export default function AudienceTable() {
  const [audience, setAudience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Search & Filter states
  const [search, setSearch] = useState("");
  const [minSpend, setMinSpend] = useState("");

  // Add Customer dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    totalSpend: "",
    visits: ""
  });

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

  // Handle Add Customer submit
  const handleAddCustomer = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      if (!res.ok) throw new Error("Failed to add customer");
      setSnackbar({ open: true, message: "Customer added successfully!", severity: "success" });
      setOpenDialog(false);
      setNewCustomer({ name: "", email: "", phone: "", totalSpend: "", visits: "" });
      fetchAudience();
    } catch (err) {
      setSnackbar({ open: true, message: "Error adding customer", severity: "error" });
    }
  };

  // Apply search & filters
  const filteredAudience = audience.filter(cust => {
    const matchSearch =
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.email.toLowerCase().includes(search.toLowerCase()) ||
      cust.phone.toLowerCase().includes(search.toLowerCase());

    const matchSpend = minSpend ? cust.totalSpend >= parseFloat(minSpend) : true;

    return matchSearch && matchSpend;
  });

  if (loading) return <CircularProgress sx={{ mt: 8 }} />;

  return (
    <Box sx={{ width: '100%', py: 4, background: '#f6fafd', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8', textAlign: 'center', mb: 2 }}>
          Audience
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368', textAlign: 'center', mb: 4 }}>
          View, search, and manage customers in your CRM audience.
        </Typography>

        {/* Search & Actions */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3, justifyContent: "space-between" }}>
          <TextField
            label="Search by Name/Email/Phone"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Min Spend (₹)"
            type="number"
            variant="outlined"
            size="small"
            value={minSpend}
            onChange={(e) => setMinSpend(e.target.value)}
            sx={{ width: 180 }}
          />
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
            ➕ Add Customer
          </Button>
        </Stack>

        {/* Audience Table */}
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <TableContainer sx={{ borderRadius: 3, boxShadow: 2, maxHeight: 600 }}>
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
                {filteredAudience.map((cust, idx) => (
                  <TableRow key={cust._id} hover sx={{
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fbfd',
                    transition: 'all 0.2s',
                    '&:hover': { background: '#e3f2fd' }
                  }}>
                    <TableCell sx={{ fontWeight: 500 }}>{cust.name}</TableCell>
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

      {/* Add Customer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} fullWidth />
            <TextField label="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} fullWidth />
            <TextField label="Phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} fullWidth />
            <TextField label="Total Spend (₹)" type="number" value={newCustomer.totalSpend} onChange={(e) => setNewCustomer({ ...newCustomer, totalSpend: e.target.value })} fullWidth />
            <TextField label="Visits" type="number" value={newCustomer.visits} onChange={(e) => setNewCustomer({ ...newCustomer, visits: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleAddCustomer}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
