import * as React from 'react';
import { Drawer, Box, IconButton, Tooltip, Stack, Divider, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ContactsIcon from '@mui/icons-material/Contacts';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'; // ✅ your logo component

const sidebarWidth = 80;

const navItems = [
  { label: 'Home', icon: <HomeIcon />, to: '/' },
  { label: 'Campaigns', icon: <CampaignIcon />, to: '/campaigns' },
  { label: 'Segmentation', icon: <GroupWorkIcon />, to: '/segmentation' },
  { label: 'Audience', icon: <ContactsIcon />, to: '/audience' },
  { label: 'AI Suggestion', icon: <LightbulbIcon />, to: '/ai-suggestion' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('google_token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a73e8, #0d47a1)', // gradient blue
          color: '#fff',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        },
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ textAlign: 'center', mb: 3, mt: 1 }}>
        <Logo size={40} /> {/* ✅ use your logo component */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: 1,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          XCRM
        </Typography>
      </Box>

      <Divider sx={{ width: 32, bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }} />

      {/* Navigation */}
      <Stack spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Tooltip title={item.label} placement="right" key={item.label}>
              <IconButton
                component={Link}
                to={item.to}
                sx={{
                  color: active ? '#1a73e8' : '#fff',
                  background: active ? '#fff' : 'transparent',
                  boxShadow: active ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  borderRadius: 3,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: active
                      ? '#f1f5ff'
                      : 'rgba(255,255,255,0.15)',
                    color: active ? '#1a73e8' : '#e3f2fd',
                    transform: 'scale(1.05)',
                  },
                  width: 48,
                  height: 48,
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>

      {/* Logout */}
      <Box sx={{ mb: 2 }}>
        <Tooltip title="Logout" placement="right">
          <IconButton
            onClick={handleLogout}
            sx={{
              color: '#fff',
              transition: 'all 0.2s',
              '&:hover': {
                color: '#ff5252',
                background: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
