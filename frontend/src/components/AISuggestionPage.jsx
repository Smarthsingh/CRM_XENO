import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Gift,
  RefreshCw,
  Copy,
  Sparkles,
} from "lucide-react";

const promptOptions = [
  {
    key: "highSpenders",
    icon: <TrendingUp color="#22c55e" size={28} />,
    label: "Campaign for high spenders",
    bg: "#ecfdf5",
    text: "#065f46",
    border: "#34d399",
  },
  {
    key: "inactiveUsers",
    icon: <Users color="#f59e42" size={28} />,
    label: "Re-engagement for inactive users",
    bg: "#fff7ed",
    text: "#9a3412",
    border: "#fdba74",
  },
  {
    key: "frequentVisitors",
    icon: <MessageSquare color="#3b82f6" size={28} />,
    label: "Upsell to frequent visitors",
    bg: "#eff6ff",
    text: "#1e3a8a",
    border: "#60a5fa",
  },
  {
    key: "festiveOffer",
    icon: <Gift color="#a855f7" size={28} />,
    label: "Festive offer message",
    bg: "#faf5ff",
    text: "#6d28d9",
    border: "#c084fc",
  },
];

const ruleBasedSuggestions = {
  highSpenders: [
    "Unlock exclusive VIP rewards for top customers! Enjoy 20% off your next premium purchase.",
    "As one of our premium customers, claim free priority shipping all month.",
    "Special gift for premium customers! Free luxury gift on orders over $100.",
  ],
  inactiveUsers: [
    "We miss you! Come back and get a 15% welcome-back discount.",
    "It’s been a while! Enjoy 20% off site-wide if you shop today.",
    "Reactivate now and get a surprise coupon worth up to $50!",
  ],
  frequentVisitors: [
    "Earn double loyalty points this week as our thank-you for shopping often!",
    "Exclusive BOGO offer on select premium items just for you.",
    "Get early VIP access to new arrivals before anyone else!",
  ],
  festiveOffer: [
    "Celebrate the season with 25% off festive collection! Use code HOLIDAY25.",
    "Special festive savings 🎉 Use code FESTIVE20 for 20% off seasonal items.",
    "Gift bundles: Buy 3, get 1 free on all festive gift sets!",
  ],
};

export default function AISuggestionPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handlePromptSelect = (key) => {
    setSelectedPrompt(key);
    setSuggestions(ruleBasedSuggestions[key]);
    setCopiedIndex(null);
  };

  const handleRegenerate = () => {
    if (selectedPrompt) {
      setSuggestions(
        [...ruleBasedSuggestions[selectedPrompt]].sort(() => Math.random() - 0.5)
      );
      setCopiedIndex(null);
    }
  };

  const handleCopy = (msg, idx) => {
    navigator.clipboard.writeText(msg);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Box sx={{ background: "#f9fbff", minHeight: "100vh", py: 6 }}>
      {/* Header */}
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          textAlign: "center",
          mb: 5,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #e0f2ff, #f5f3ff)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a73e8" }}>
          <Sparkles size={26} style={{ marginRight: 6 }} />
          AI Campaign Suggestions
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#475569", maxWidth: 600, mx: "auto", mt: 1 }}
        >
          Choose a campaign type below and get AI-generated personalized
          messages for your audience.
        </Typography>
      </Box>

      {/* Campaign Options */}
     {/* Campaign Options */}
<Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
  <Grid
    container
    spacing={3}
    sx={{ maxWidth: 700 }}   // keeps it centered & compact
    justifyContent="center"
  >
    {promptOptions.map((opt) => (
      <Grid item xs={12} sm={6} key={opt.key}>
        <Paper
          elevation={selectedPrompt === opt.key ? 6 : 2}
          sx={{
            p: 3,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderRadius: 3,
            border:
              selectedPrompt === opt.key
                ? `2px solid ${opt.border}`
                : "1px solid #e5e7eb",
            background: selectedPrompt === opt.key ? opt.bg : "#fff",
            cursor: "pointer",
            transition: "all 0.25s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            },
          }}
          onClick={() => handlePromptSelect(opt.key)}
        >
          <Box sx={{ mr: 2 }}>{opt.icon}</Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: selectedPrompt === opt.key ? opt.text : "#222",
            }}
          >
            {opt.label}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>


      {/* Suggestions */}
      {selectedPrompt && (
        <Paper
          elevation={4}
          sx={{
            maxWidth: 850,
            mx: "auto",
            p: 4,
            borderRadius: 4,
            background: "#fff",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                color: "#1a73e8",
              }}
            >
              {promptOptions.find((p) => p.key === selectedPrompt)?.icon}
              <span style={{ marginLeft: 8 }}>
                {promptOptions.find((p) => p.key === selectedPrompt)?.label}
              </span>
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
              onClick={handleRegenerate}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Refresh
            </Button>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {/* AI Suggestions Chat Style */}
          <Stack spacing={2}>
            {suggestions.map((msg, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  bgcolor: copiedIndex === idx ? "#ecfdf5" : "#f9fafb",
                  border:
                    copiedIndex === idx
                      ? "1px solid #34d399"
                      : "1px solid #e5e7eb",
                }}
                elevation={1}
              >
                <MessageSquare
                  color="#1a73e8"
                  size={20}
                  style={{ marginRight: 12 }}
                />
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {msg}
                </Typography>
                <IconButton
                  onClick={() => handleCopy(msg, idx)}
                  color={copiedIndex === idx ? "success" : "default"}
                  sx={{ borderRadius: 2 }}
                >
                  {copiedIndex === idx ? "✔" : <Copy size={18} />}
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
