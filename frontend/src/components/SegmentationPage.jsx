import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { TrendingUp, Users, Clock, BarChart2, Link2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

// Labels
const statLabels = {
  mean: 'Average',
  median: 'Typical',
  min: 'Minimum',
  max: 'Maximum',
  stddev: 'Variation',
};

// Metrics meta
const metricMeta = {
  spend: {
    label: 'Customer Spend',
    icon: <TrendingUp color="#22c55e" size={28} />,
    color: '#22c55e',
    unit: '₹',
  },
  visits: {
    label: 'Customer Visits',
    icon: <Users color="#3b82f6" size={28} />,
    color: '#3b82f6',
    unit: '',
  },
  recency: {
    label: 'Recency (days since last active)',
    icon: <Clock color="#f59e42" size={28} />,
    color: '#f59e42',
    unit: '',
  },
};

// Correlation meta
const correlationMeta = {
  spend_vs_visits: {
    label: 'Spend vs Visits',
    icon: <Link2 color="#3b82f6" size={24} />,
    color: '#3b82f6',
  },
  spend_vs_recency: {
    label: 'Spend vs Recency',
    icon: <Link2 color="#8b5cf6" size={24} />,
    color: '#8b5cf6',
  },
  visits_vs_recency: {
    label: 'Visits vs Recency',
    icon: <Link2 color="#f59e42" size={24} />,
    color: '#f59e42',
  },
};

// Helper for correlation interpretation
const interpretCorrelation = (value) => {
  if (Math.abs(value) > 0.7) return 'Strong';
  if (Math.abs(value) > 0.4) return 'Moderate';
  if (Math.abs(value) > 0.2) return 'Weak';
  return 'None';
};

// Stats Block
const statIcons = {
  mean: <TrendingUp size={18} color="#22c55e" />,
  median: <Users size={18} color="#3b82f6" />,
  min: <Clock size={18} color="#f59e42" />,
  max: <BarChart2 size={18} color="#8b5cf6" />,
  stddev: <Link2 size={18} color="#ef4444" />,
};

const StatsBlock = ({ stats, unit }) => (
  <Grid container spacing={2} justifyContent="center" sx={{ my: 2 }}>
    {Object.entries(stats).map(([key, value]) => (
      <Grid item xs={6} sm={4} md={2.4} key={key}>
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Stack direction="column" alignItems="center" spacing={1}>
            {statIcons[key]}
            <Typography variant="caption" color="text.secondary">
              {statLabels[key]}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {unit}
              {typeof value === "number" ? value.toFixed(2) : value}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Histogram Chart
const Histogram = ({ data, title, color }) => (
  <Box sx={{ my: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      <BarChart2 size={20} color={color} />
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title} Distribution
      </Typography>
    </Stack>
    <Box sx={{ height: 280, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
          <XAxis
            dataKey="range"
            angle={-20}
            interval="preserveStartEnd"
            height={60}
            tick={{ fontSize: 12, fill: "#444" }}
            tickFormatter={(val) =>
              val.length > 10 ? val.slice(0, 10) + "…" : val
            }
          />
          <YAxis allowDecimals={false} />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="count" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

// Trend Chart
const TrendChart = ({ data, title, color }) => (
  <Box sx={{ my: 2 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      <TrendingUp size={20} color={color} />
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title} Trend (12 months)
      </Typography>
    </Stack>
    <Box sx={{ height: 280, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
          <XAxis
            dataKey="month"
            interval="preserveStartEnd"
            angle={-20}
            height={60}
            tick={{ fontSize: 12, fill: "#444" }}
          />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 5, fill: color }}
            activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

// Correlation Card
const CorrelationCard = ({ value, meta }) => (
  <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', p: 2 }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        {meta.icon}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: meta.color }}>
            {meta.label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: meta.color }}>
            {value.toFixed(2)} ({interpretCorrelation(value)})
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// Metric Section
// Metric Section
const MetricSection = ({ metric, data }) => {
  const meta = metricMeta[metric];
  return (
    <Card
      sx={{
        mb: 3,                // smaller bottom margin
        p: 2.5,               // reduced padding
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <CardContent sx={{ p: 0 }}>   {/* remove extra padding */}
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          {meta.icon}
          <Typography variant="h6" sx={{ fontWeight: 700, color: meta.color }}>
            {meta.label}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />

        {/* Stats Row */}
        <StatsBlock stats={data.stats} unit={meta.unit} />

        {/* Charts */}
        <Grid container spacing={2} alignItems="stretch" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 1.5,
                background: '#fff',
                borderRadius: 2,
                height: 240,   // reduced
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}
            >
              <Histogram data={data.hist} title={meta.label} color={meta.color} />
            </Box>
          </Grid>
          {data.trend && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 1.5,
                  background: '#fff',
                  borderRadius: 2,
                  height: 240,   // reduced
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                <TrendChart data={data.trend} title={meta.label} color={meta.color} />
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};


const SegmentationPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/segments/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1250, mx: 'auto', p: 4, background: '#f9fbff', minHeight: '100vh' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a73e8', letterSpacing: '0.5px', mb: 1 }}>
          Segmentation Analytics
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#5f6368' }}>
          Smarter targeting through automatic segmentation, trends, and correlations.
        </Typography>
      </Box>
      {analytics && (
        <>
          <MetricSection metric="spend" data={analytics.spend} />
          <MetricSection metric="visits" data={analytics.visits} />
          <MetricSection metric="recency" data={analytics.recency} />
          <Typography variant="h5" sx={{ mt: 4, mb: 3, fontWeight: 700, color: '#1a73e8' }}>
            Correlations & Insights
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(analytics.correlations).map(([key, value]) => (
              <Grid item xs={12} md={4} key={key}>
                <CorrelationCard value={value} meta={correlationMeta[key]} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SegmentationPage;
