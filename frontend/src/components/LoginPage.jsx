import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Logo from "../components/Logo"; 


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
        localStorage.setItem("app_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDE - Illustration */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          p: 6,
          background: "linear-gradient(135deg, #1a73e8 0%, #6dd5ed 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 3,
          }}
        >
          Welcome to <span style={{ color: "#ffd700" }}>XCRM</span>
        </Typography>
        <Typography
          variant="h6"
          sx={{ maxWidth: 400, lineHeight: 1.6, opacity: 0.9 }}
        >
          Manage customers smarter, run campaigns with ease, and unlock growth 🚀
        </Typography>

        {/* Illustration (you can replace with an SVG or image) */}
        {/* <Box
          component="img"
          src="https://cdn.dribbble.com/users/25514/screenshots/15014243/media/040f6294c60d7cfbe671efbb3488da26.png?compress=1&resize=1000x750"
          alt="CRM Illustration"
          sx={{
            maxWidth: 420,
            width: "100%",
            mt: 4,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        /> */}
      </Box>

      {/* RIGHT SIDE - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fbff",
        }}
      >
        <GoogleOAuthProvider clientId={clientId}>
          <Card
            sx={{
              minWidth: 360,
              maxWidth: 420,
              p: 3,
              borderRadius: 4,
              backdropFilter: "blur(16px)",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent>
              <Stack spacing={3} alignItems="center">
                {/* Logo / Brand */}
                <Stack direction="row" alignItems="center" spacing={1}>
  <Logo size={40} />
  <Typography
    variant="h4"
    sx={{
      fontWeight: 800,
      background: "linear-gradient(90deg, #1a73e8, #6dd5ed)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    XCRM
  </Typography>
</Stack>

                <Typography
                  variant="subtitle1"
                  sx={{ color: "#5f6368", textAlign: "center", mb: 2 }}
                >
                  Your Mini CRM for Smart Customer Management
                </Typography>

                {/* Google Login */}
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => alert("Google Login Failed")}
                  width="100%"
                  theme="filled_blue"
                  text="signin_with"
                  shape="pill"
                  logo_alignment="left"
                />

                {/* Guest Mode */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: "none",
                    background: "linear-gradient(90deg, #1a73e8, #6dd5ed)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1765c7, #4fc3e8)",
                    },
                  }}
                  onClick={handleEnter}
                >
                  Enter as Guest
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </GoogleOAuthProvider>
      </Box>
    </Box>
  );
}
