import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, Dialog, DialogContent,
  IconButton, Stack, Tooltip, DialogTitle, DialogActions, Box, Chip,
  Snackbar, Alert
} from '@mui/material';
import CampaignForm from './CampaignForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const API_URL = import.meta.env.VITE_API_URL;

function renderRules(rules) {
  if (!rules) return '-';
  if (Array.isArray(rules)) {
    return rules.map(c => c ? `${c.field} ${c.operator} ${c.value}` : '').join(' AND ');
  }
  if (typeof rules === 'string') return rules;
  if (rules.logic && Array.isArray(rules.conditions)) {
    return rules.conditions.map(c => c ? `${c.field} ${c.operator} ${c.value}` : '').join(` ${rules.logic} `);
  }
  if (rules.field && rules.operator && rules.value !== undefined) {
    return `${rules.field} ${rules.operator} ${rules.value}`;
  }
  return '-';
}

export default function CampaignsTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [sendDialog, setSendDialog] = useState({ open: false, campaignId: null, campaignName: '', message: '' });
  const [failedDialog, setFailedDialog] = useState({ open: false, customers: [], campaignName: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCampaigns = () => {
    setLoading(true);
    fetch(`${API_URL}/api/campaigns`)
      .then(res => res.json())
      .then(data => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchStats = () => {
    fetch(`${API_URL}/api/campaigns/stats`)
      .then(res => res.json())
      .then(data => {
        const statsMap = {};
        data.forEach(s => { statsMap[s.campaignId] = s; });
        setStats(statsMap);
      });
  };

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, []);

  const handleCreated = () => {
    setOpen(false);
    setEditCampaign(null);
    fetchCampaigns();
    fetchStats();
  };

  const handleEdit = (id) => {
    const campaign = campaigns.find(c => c._id === id);
    setEditCampaign(campaign);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`${API_URL}/api/campaigns/${deleteId}`, { method: 'DELETE' });
      setSnackbar({ open: true, message: 'Campaign deleted successfully!', severity: 'success' });
      setDeleteId(null);
      fetchCampaigns();
      fetchStats();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete campaign.', severity: 'error' });
    }
  };

  const handleSend = async () => {
    if (!sendDialog.campaignId || !sendDialog.message.trim()) return;
    try {
      await fetch(`${API_URL}/api/campaigns/${sendDialog.campaignId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sendDialog.message }),
      });
      setSnackbar({ open: true, message: 'Message sent successfully!', severity: 'success' });
      setSendDialog({ open: false, campaignId: null, campaignName: '', message: '' });
      fetchCampaigns();
      fetchStats();
    } catch {
      setSnackbar({ open: true, message: 'Failed to send message.', severity: 'error' });
    }
  };

  const handleShowFailed = async (campaignId, campaignName) => {
    const res = await fetch(`${API_URL}/api/campaigns/${campaignId}/failed-customers`);
    const customers = await res.json();
    setFailedDialog({ open: true, customers, campaignName });
  };

  if (loading) return <CircularProgress sx={{ mt: 8 }} />;

  return (
    <Box sx={{ width: '100%', py: 4, background: '#f6fafd', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8', textAlign: 'center', mb: 2 }}>
          Campaigns
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368', textAlign: 'center', mb: 4 }}>
          Manage your campaigns, create new ones, and view delivery statistics.
        </Typography>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Campaigns
            </Typography>
            <Button variant="contained" onClick={() => { setEditCampaign(null); setOpen(true); }} sx={{ fontWeight: 600, borderRadius: 2 }}>
              Create Campaign
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ background: '#f6fafd' }}>
                  <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      Audience Size
                      <Tooltip title="Number of customers who matched the campaign rule at creation.">
                        <InfoOutlinedIcon fontSize="small" color="action" />
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Sent</TableCell>
                  <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Failed</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, background: '#f6fafd' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((row) => (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f0fc' } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                    <TableCell>
                      <Chip label={row.audienceSize} color="primary" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={typeof stats[row._id]?.sent === 'number' ? stats[row._id].sent : 0} color="success" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={<ErrorOutlineIcon />}
                        onClick={() => handleShowFailed(row._id, row.name)}
                        disabled={!stats[row._id]?.failed}
                        sx={{ fontWeight: 600 }}
                      >
                        {typeof stats[row._id]?.failed === 'number' ? stats[row._id].failed : 0}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEdit(row._id)} sx={{ borderRadius: 2, background: '#e3f0fc', '&:hover': { background: '#d1eaff' } }}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => setDeleteId(row._id)} sx={{ borderRadius: 2, background: '#ffeaea', '&:hover': { background: '#ffd6d6' } }}><DeleteIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Send Message">
                          <IconButton color="success" onClick={() => setSendDialog({ open: true, campaignId: row._id, campaignName: row.name, message: '' })} sx={{ borderRadius: 2, background: '#e6f9f0', '&:hover': { background: '#c6f6e6' } }}><SendIcon /></IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Campaign Create/Edit Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditCampaign(null); }} maxWidth="sm" fullWidth>
        <DialogContent>
          <CampaignForm onCreated={handleCreated} editData={editCampaign} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Campaign?</DialogTitle>
        <DialogContent>Are you sure you want to delete this campaign?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={sendDialog.open} onClose={() => setSendDialog({ open: false, campaignId: null, campaignName: '', message: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to: {sendDialog.campaignName}</DialogTitle>
        <DialogContent sx={{ minWidth: 500 }}>
          <TextField
            label="Message"
            value={sendDialog.message}
            onChange={e => setSendDialog({ ...sendDialog, message: e.target.value })}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialog({ open: false, campaignId: null, campaignName: '', message: '' })}>Cancel</Button>
          <Button color="success" variant="contained" onClick={handleSend} disabled={!sendDialog.message.trim()}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* Failed Deliveries Dialog */}
      <Dialog open={failedDialog.open} onClose={() => setFailedDialog({ open: false, customers: [], campaignName: '' })} maxWidth="xs" fullWidth>
        <DialogTitle>Failed Deliveries for: {failedDialog.campaignName}</DialogTitle>
        <DialogContent>
          {failedDialog.customers.length === 0 ? (
            <Typography>No failed deliveries for this campaign.</Typography>
          ) : (
            <List>
              {failedDialog.customers.map((cust, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={cust.name}
                    secondary={`${cust.email} | ${cust.phone}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFailedDialog({ open: false, customers: [], campaignName: '' })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
