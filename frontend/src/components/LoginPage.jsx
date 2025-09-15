import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const patternBg = `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="white"/><rect x="20" width="1" height="40" fill="%23e0e7ef"/><rect y="20" width="40" height="1" fill="%23e0e7ef"/></svg>')`;

export default function LoginPage() {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // ✅ Google login flow
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (data.token) {
        // Save backend-issued token
        localStorage.setItem("app_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // optional, store user info
        navigate("/");
      } else {
        alert("Google login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login request failed");
    }
  };

  // ✅ Guest/demo mode
  const handleEnter = () => {
    localStorage.setItem("app_token", "guest_mode");
    navigate("/");
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: `${patternBg}, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <GoogleOAuthProvider clientId={clientId}>
        <Card sx={{ minWidth: 350, maxWidth: 400, p: 3, boxShadow: 6, borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8' }}>
                XCRM
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368', mb: 4 }}>
                Your Mini CRM for Smart Customer Management
              </Typography>
              
              {/* Google Login */}
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => alert('Google Login Failed')}
                width="100%"
                theme="filled_blue"
                text="signin_with"
                shape="pill"
                logo_alignment="left"
              />

              {/* Guest Mode */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                onClick={handleEnter}
              >
                Enter as Guest
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </GoogleOAuthProvider>
    </Box>
  );
}
