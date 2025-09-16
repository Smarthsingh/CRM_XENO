import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Megaphone,
  Users,
  Layers,
  Sparkles,
  Bell,
  Calendar,
  Plug,
  BarChart3,
} from 'lucide-react';
import Logo from './Logo';

const features = [
  {
    icon: <Megaphone color="#1a73e8" size={36} />,
    title: 'Campaigns',
    desc: 'Create, manage, and track personalized marketing campaigns.',
    link: '/campaigns',
  },
  {
    icon: <Layers color="#f59e42" size={36} />,
    title: 'Segmentation',
    desc: 'Segment your customers with flexible, rule-based logic.',
    link: '/segmentation',
  },
  {
    icon: <Users color="#22c55e" size={36} />,
    title: 'Audience',
    desc: 'Manage and analyze your customer base in one place.',
    link: '/audience',
  },
  {
    icon: <Sparkles color="#a855f7" size={36} />,
    title: 'AI Insights',
    desc: 'Leverage AI for smart suggestions and campaign insights.',
    link: '/ai-suggestion',
  },
  {
    icon: <Plug color="#06b6d4" size={36} />,
    title: 'Integrations',
    desc: 'Connect with your favorite tools and platforms seamlessly.',
    link: '#',
  },
  {
    icon: <BarChart3 color="#f43f5e" size={36} />,
    title: 'Reports & Analytics',
    desc: 'Visualize performance and gain actionable insights.',
    link: '#',
  },
];

export default function HomePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest User' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch campaigns
        const resCampaigns = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns`);
        const dataCampaigns = await resCampaigns.json();
        setCampaigns(dataCampaigns);

        // Fetch campaign stats
        const resStats = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/stats`);
        const dataStats = await resStats.json();
        const statsMap = {};
        dataStats.forEach((s) => {
          statsMap[s.campaignId] = s;
        });
        setStats(statsMap);

        // Fetch customers
        const resCustomers = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`);
        const dataCustomers = await resCustomers.json();
        setCustomers(dataCustomers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Quick stats values
  const quickStats = [
    { icon: '👥', label: 'Total Customers', value: customers.length },
    { icon: '📊', label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'Active').length },
    {
      icon: '💰',
      label: 'Total Spend',
      value: `₹${customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0)}`,
    },
    { icon: '🎯', label: 'Segments', value: 5 }, // replace with API if available
  ];

  return (
    <Box sx={{ background: '#f9fbff', minHeight: '100vh' }}>
      {/* Banner */}
     {/* Banner */}
<Box
  sx={{
    background: 'linear-gradient(135deg,#1a73e8,#2563eb)',
    color: 'white',
    py: 6,
    px: { xs: 2, md: 6 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  <Stack spacing={2}>
    <Logo size={48} />
    <Typography variant="h4" sx={{ fontWeight: 800 }}>
      Welcome back, {user.name} 👋
    </Typography>
    <Typography sx={{ maxWidth: 600, opacity: 0.9 }}>
      Manage campaigns, analyze customers, and discover AI-driven insights.
    </Typography>
  </Stack>

  {/* User Profile */}
  <Paper
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: 'rgba(255,255,255,0.15)',
      color: 'white',
      backdropFilter: 'blur(6px)',
      minWidth: 220,
    }}
    elevation={0}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <img
        src={user.picture || 'https://i.pravatar.cc/50'}
        alt="avatar"
        style={{ width: 50, height: 50, borderRadius: '50%' }}
      />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>
        <Typography variant="caption">{user.email}</Typography>
      </Box>
    </Stack>
  </Paper>
</Box>

{/* Quick Stats (centered row) */}
<Grid
  container
  spacing={3}
  justifyContent="center"
  sx={{ px: { xs: 2, md: 6 }, mt: 3, textAlign: "center" }}
>
  {quickStats.map((stat, i) => (
    <Grid
      item
      xs={6}
      sm={4}
      md={3}
      key={i}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          textAlign: "center",
          width: 200,
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          transition: "all 0.3s",
          "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
        }}
      >
        <Typography sx={{ fontSize: 28, mb: 1 }}>{stat.icon}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {stat.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {stat.label}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

{/* Features (centered grid) */}
<Grid
  container
  spacing={4}
  justifyContent="center"
  sx={{ mb: 4, px: { xs: 2, md: 6 }, mt: 6 }}
>
  {features.map((f, i) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      key={i}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          width: 260,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          boxShadow: 4,
          transition: "all 0.3s",
          "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
        }}
      >
        <Box sx={{ mb: 2 }}>{f.icon}</Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, textAlign: "center" }}
        >
          {f.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {f.desc}
        </Typography>
        <Button
          href={f.link}
          size="small"
          sx={{
            mt: "auto",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Learn more
        </Button>
      </Paper>
    </Grid>
  ))}
</Grid>

     {/* Notifications, Upcoming Campaigns & Activity */}
<Grid
  container
  spacing={4}
  justifyContent="center"
  sx={{
    px: { xs: 2, md: 6 },
    mb: 6,
    mt: 4,
    maxWidth: "1200px",
    mx: "auto",
  }}
>
  {/* Recent Notifications */}
  <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        minHeight: 280, // uniform height
        width: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Bell color="#1a73e8" size={22} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Recent Notifications
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {campaigns.slice(-3).reverse().map((c, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box
              sx={{
                width: 4,
                height: 36,
                borderRadius: 2,
                background: "#1a73e8",
                mr: 2,
                mt: 0.5,
              }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Campaign "{c.name}" {stats[c._id]?.sent > 0 ? "sent" : "created"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(c.createdAt).toLocaleString()}
              </Typography>
              {stats[c._id] && (
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={`Sent: ${stats[c._id].sent || 0}`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`Failed: ${stats[c._id].failed || 0}`}
                    color="error"
                    size="small"
                  />
                </Stack>
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  </Grid>

  {/* Upcoming Campaigns */}
  <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        minHeight: 280, // uniform height
        width: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Calendar color="#1a73e8" size={22} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Upcoming Campaigns
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {loading ? (
          <Typography>Loading campaigns...</Typography>
        ) : campaigns.length === 0 ? (
          <Typography>No campaigns found.</Typography>
        ) : (
          campaigns.map((c, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {c.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {c.scheduledAt
                    ? new Date(c.scheduledAt).toLocaleDateString()
                    : "No date set"}
                </Typography>
              </Box>
              <Chip
                label={c.status || "Draft"}
                color={
                  c.status === "Scheduled"
                    ? "primary"
                    : c.status === "Ready"
                    ? "success"
                    : "warning"
                }
                size="small"
                sx={{ fontWeight: 600, fontSize: 13 }}
              />
            </Box>
          ))
        )}
      </Stack>
    </Paper>
  </Grid>

  {/* Recent Activity */}
  <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        minHeight: 280, // uniform height
        width: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <BarChart3 color="#1a73e8" size={22} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Recent Activity
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={3}>
        {[
          { text: 'You created a new campaign "Diwali Offers"', time: "2 hrs ago" },
          { text: 'Segment "High Spenders" updated with 12 new customers', time: "Yesterday" },
          { text: "AI Suggested festive offer message added", time: "2 days ago" },
        ].map((activity, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#1a73e8",
                mt: "6px",
                mr: 2,
              }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {activity.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  </Grid>
</Grid>

    </Box>
  );
}
