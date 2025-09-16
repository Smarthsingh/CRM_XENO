// src/components/Logo.jsx
import React from "react";

export default function Logo({ size = 48 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id="xcrmGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a73e8" />
          <stop offset="100%" stopColor="#6dd5ed" />
        </linearGradient>
      </defs>

      {/* X Shape */}
      <path
        d="M20 20 L80 80 M80 20 L20 80"
        stroke="url(#xcrmGradient)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Circles (CRM nodes) */}
      <circle cx="20" cy="20" r="8" fill="#ffd700" />
      <circle cx="80" cy="20" r="8" fill="#ff6ec7" />
      <circle cx="20" cy="80" r="8" fill="#4caf50" />
      <circle cx="80" cy="80" r="8" fill="#ff9800" />
    </svg>
  );
}
