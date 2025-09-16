import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, Dialog, DialogContent,
  IconButton, Stack, Tooltip, DialogTitle, DialogActions, Box,
  Snackbar, Alert, Chip, Divider, TextField
} from '@mui/material';
import CampaignForm from './CampaignForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const API_URL = import.meta.env.VITE_API_URL;

export default function CampaignsTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [sendOpen, setSendOpen] = useState(false);
  const [sendCampaign, setSendCampaign] = useState(null);
  const [message, setMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`${API_URL}/api/campaigns/${deleteId}`, { method: 'DELETE' });
      setSnackbar({ open: true, message: '✅ Campaign deleted!', severity: 'success' });
      setDeleteId(null);
      fetchCampaigns();
      fetchStats();
    } catch {
      setSnackbar({ open: true, message: '❌ Failed to delete.', severity: 'error' });
    }
  };

  const handleSend = async () => {
    if (!sendCampaign || !message.trim()) return;
    try {
      await fetch(`${API_URL}/api/campaigns/${sendCampaign._id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      setSnackbar({ open: true, message: "✅ Campaign sent successfully!", severity: "success" });
      setSendOpen(false);
      setMessage('');
      setAiSuggestions([]);
      fetchStats();
    } catch {
      setSnackbar({ open: true, message: "❌ Failed to send campaign", severity: "error" });
    }
  };

  const getAISuggestions = async () => {
    if (!sendCampaign) return;
    setAiLoading(true);
    setAiSuggestions([]);
    try {
      const res = await fetch(`${API_URL}/api/ai/suggest-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective: `Write 3 short marketing messages for campaign: ${sendCampaign.name}` }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (err) {
      setSnackbar({ open: true, message: "⚠️ Failed to fetch AI suggestions", severity: "error" });
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 8 }} />;

  return (
    <Box sx={{ width: '100%', py: 4, background: 'linear-gradient(to right,#f9fbfd,#f3f7fb)', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom
          sx={{
            fontWeight: 800,
            textAlign: 'center',
            background: 'linear-gradient(90deg,#1976d2,#42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
          Campaigns Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368', textAlign: 'center', mb: 4 }}>
          Create, manage and analyze your marketing campaigns.
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Active Campaigns</Typography>
            <Button variant="contained" onClick={() => { setEditCampaign(null); setOpen(true); }}
              sx={{ borderRadius: 3, textTransform: 'none', px: 3, py: 1.2, fontWeight: 600 }}>
              + New Campaign
            </Button>
          </Box>

          {campaigns.length === 0 ? (
            <Typography align="center" sx={{ color: '#888', my: 4 }}>🚀 No campaigns yet. Create your first campaign!</Typography>
          ) : (
            <TableContainer sx={{ borderRadius: 3, boxShadow: 2, maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        Audience
                        <Tooltip title="Number of customers matching rules at creation">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sent</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Failed</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.map((row) => (
                    <TableRow key={row._id} hover sx={{ '&:hover': { background: '#f1f6fd' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell><Chip label={row.audienceSize} color="primary" /></TableCell>
                      <TableCell><Chip label={stats[row._id]?.sent || 0} color="success" /></TableCell>
                      <TableCell>
                        <Chip
                          label={stats[row._id]?.failed || 0}
                          color={stats[row._id]?.failed ? "error" : "default"}
                          icon={<ErrorOutlineIcon />}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit"><IconButton color="primary" onClick={() => { setEditCampaign(row); setOpen(true); }}><EditIcon /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleteId(row._id)}><DeleteIcon /></IconButton></Tooltip>
                          <Tooltip title="Send"><IconButton color="success" onClick={() => { setSendCampaign(row); setSendOpen(true); }}><SendIcon /></IconButton></Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Create/Edit Campaign */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent><CampaignForm onCreated={handleCreated} editData={editCampaign} /></DialogContent>
      </Dialog>

      {/* Send Campaign Dialog */}
      <Dialog open={sendOpen} onClose={() => setSendOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Campaign: {sendCampaign?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your campaign message here..."
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            onClick={getAISuggestions}
            disabled={aiLoading}
            sx={{ mb: 2 }}
          >
            {aiLoading ? "Getting Suggestions..." : "✨ Get AI Suggestions"}
          </Button>

          {aiSuggestions.length > 0 && (
            <Stack spacing={1}>
              {aiSuggestions.map((s, i) => (
                <Paper
                  key={i}
                  onClick={() => setMessage(s)}
                  sx={{
                    p: 1.5,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <Typography variant="body2">{s}</Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendOpen(false)}>Cancel</Button>
          <Button onClick={handleSend} variant="contained" color="success">Send</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Campaign?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
